import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { observer } from "mobx-react-lite";
import { listItemsStore } from "@stores/listItemsStore";
import "./scrollList.css";
import seconds from "@stores/seconds.js";

const AnimatedItem = ({ children, index, onMouseEnter, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, once: false });

  return (
    <motion.div
      layout
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ opacity: 0, y: -20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
        delay: index * 0.03,
      }}
      style={{
        marginBottom: "1rem",
        cursor: "pointer",
        position: "relative",
        transformOrigin: "center top",
      }}
      className="animated-item"
    >
      {children}
    </motion.div>
  );
};

const ScrollList = observer(
  ({
    // Store is used instead of items prop
    onItemSelect,
    showGradients = true,
    enableArrowNavigation = true,
    className = "",
    itemClassName = "",
    displayScrollbar = false,
    initialSelectedIndex = -1,
  }) => {
    const listRef = useRef(null);
    const [keyboardNav, setKeyboardNav] = useState(false);
    const [topGradientOpacity, setTopGradientOpacity] = useState(0);
    const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

    // Use MobX store for items and selection
    const { items, selectedIndex } = listItemsStore;

    // Initialize selected index from prop
    useEffect(() => {
      if (initialSelectedIndex >= 0) {
        listItemsStore.setSelectedIndex(initialSelectedIndex);
      }
    }, [initialSelectedIndex]);

    useEffect(() => {
      listItemsStore.setSelectedIndex(0 - parseInt(seconds.seconds));
    }, [seconds.seconds]);

    const handleScroll = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      setTopGradientOpacity(Math.min(scrollTop / 50, 1));
      const bottomDistance = scrollHeight - (scrollTop + clientHeight);
      setBottomGradientOpacity(
        scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1),
      );
    };

    // Add a new item to the list using the MobX store
    const addItem = (newItem) => {
      listItemsStore.addItem(newItem);
    };

    // Keyboard navigation: arrow keys, tab, and enter selection
    useEffect(() => {
      if (!enableArrowNavigation) return;

      const handleKeyDown = (e) => {
        if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
          e.preventDefault();
          setKeyboardNav(true);
          listItemsStore.setSelectedIndex(
            Math.min(selectedIndex + 1, items.length - 1),
          );
        } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
          e.preventDefault();
          setKeyboardNav(true);
          listItemsStore.setSelectedIndex(Math.max(selectedIndex - 1, 0));
        } else if (e.key === "Enter") {
          if (selectedIndex >= 0 && selectedIndex < items.length) {
            e.preventDefault();
            if (onItemSelect) {
              onItemSelect(items[selectedIndex], selectedIndex);
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

    // Scroll the selected item into view if needed
    useEffect(() => {
      if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;

      const container = listRef.current;
      const selectedItem = container.querySelector(
        `[data-index="${selectedIndex}"]`,
      );

      if (selectedItem) {
        const extraMargin = 50;
        const containerScrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const itemTop = selectedItem.offsetTop;
        const itemBottom = itemTop + selectedItem.offsetHeight;

        if (itemTop < containerScrollTop + extraMargin) {
          container.scrollTo({
            top: itemTop - extraMargin,
            behavior: "smooth",
          });
        } else if (
          itemBottom >
          containerScrollTop + containerHeight - extraMargin
        ) {
          container.scrollTo({
            top: itemBottom - containerHeight + extraMargin,
            behavior: "smooth",
          });
        }
      }

      setKeyboardNav(false);
    }, [selectedIndex, keyboardNav]);

    return (
      <div className={`scroll-list-container ${className}`}>
        <motion.div
          ref={listRef}
          className={`items scroll-list ${!displayScrollbar ? "no-scrollbar" : ""}`}
          onScroll={handleScroll}
          layout
        >
          <AnimatePresence initial={false} mode="popLayout">
            {items.map((item, index) => (
              <AnimatedItem
                key={`item-${index}-${typeof item === "string" ? item : index}`}
                index={index}
                onMouseEnter={() => listItemsStore.setSelectedIndex(index)}
                onClick={() => {
                  listItemsStore.setSelectedIndex(index);
                  if (onItemSelect) {
                    onItemSelect(item, index);
                  }
                }}
              >
                <div
                  className={`item ${selectedIndex === index ? "selected" : ""} ${itemClassName}`}
                >
                  <p className="item-text">{item}</p>
                </div>
              </AnimatedItem>
            ))}
          </AnimatePresence>
        </motion.div>

        {showGradients && (
          <>
            <div
              className="top-gradient"
              style={{ opacity: topGradientOpacity }}
            ></div>
            <div
              className="bottom-gradient"
              style={{ opacity: bottomGradientOpacity }}
            ></div>
          </>
        )}
      </div>
    );
  },
);

// Example of usage in parent component with MobX:
//
// // Initialize store if needed
// useEffect(() => {
//   listItemsStore.setItems(['Item 1', 'Item 2']);
// }, []);
//
// useEffect(() => {
//   // Add a new item when seconds change
//   if (seconds.seconds % 5 === 0 && seconds.seconds !== 0) {
//     listItemsStore.addItem(`New Item ${Date.now()}`);
//   }
// }, [seconds.seconds]);
//
// <ScrollList />

export default ScrollList;
