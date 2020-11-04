import React, { useEffect, useState } from "react";
import "./index.scss";
export default function BugComponent() {
  const [bugs, setBugs] = useState([]);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    const resp = await fetch("https://api.github.com/repos/facebook/react/issues")
    const respJSON = await resp.json()
    setBugs(respJSON)
    setLoading(false)
  }, []);

  const handleClick = async () => {
    setLoading(true);
    const resp = await fetch(`https://api.github.com/search/issues?q=${query}+repo:facebook/react`)
    const respJSON = await resp.json()
    setBugs(respJSON.items)
    setCursor(0)
    setLoading(false)
  };

  const handleChange = (evt) => {
    setQuery(evt.target.value);
  };

  const handleKeyUp = (evt) => {
    //ArrowDown >> 40
    //ArrowUP >> 38
    //Enter >> 13
    switch (evt.keyCode) {
      case 40:
        cursor < bugs.length - 1 && setCursor(cursor + 1);
        break;
      case 38:
        cursor > 0 && setCursor(cursor - 1);
        break;
      case 13:
        handleClick();
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className="card">
        <div className="search">
          <input
            className="search__input"
            placeholder="Search Bug"
            onChange={handleChange}
            onKeyUp={handleKeyUp}
          ></input>
          <button className="search__button" onClick={handleClick}>
            <svg className="search__icon">
              <use xlinkHref="img/sprite.svg#icon-magnifying-glass"></use>
            </svg>
          </button>
        </div>

        <ul className="list">
          {loading ? (
            <div className="loader">
              <svg>
                <circle cx="70" cy="70" r="70"></circle>
              </svg>
            </div>
          ) : (
            bugs.length > 0 ?
            bugs.map((bug, index) => {
              return (
                <li
                  key={bug.id}
                  className={
                    index === cursor
                      ? "list__item list__item-selected"
                      : "list__item"
                  }
                >
                  {bug.title}
                </li>
              );
            }) :
            <p>No results found</p>
          )}
        </ul>
      </div>
    </>
  );
}
