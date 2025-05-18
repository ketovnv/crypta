import React, {
  MouseEventHandler,
  ReactNode,
  UIEvent,
  useEffect,
  useRef,
  useState,
} from "react";
// @ts-ignore
import { motion, useInView } from "motion/react";
import "./scrollList.css"; // Импортируем отдельный CSS-файл для стилей скролла

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 cursor-pointer w-full"
      style={{ display: "block", width: "100%" }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  items?: string[];
  onItemSelect?: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
  maxHeight?: number;
}

const ScrollList: React.FC<AnimatedListProps> = ({
  items = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
    "Item 8",
    "Item 9",
    "Item 10",
    "Item 11",
    "Item 12",
    "Item 13",
    "Item 14",
    "Item 15",
  ],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "",
  itemClassName = "",
  displayScrollbar = true,
  initialSelectedIndex = -1,
  maxHeight = 400,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] =
    useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } =
      e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1),
    );

    // Force reflow on scroll to ensure proper rendering
    if (listRef.current) {
      listRef.current.style.transform = "translateZ(0)";
    }

    // Отладочная информация о скролле только в режиме разработки
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Scroll - height: ${scrollHeight}, clientHeight: ${clientHeight}, scrollTop: ${scrollTop}`,
      );
    }
  };

  // Keyboard navigation: arrow keys, tab, and enter selection
  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
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

    // Apply critical styles to ensure scroll works
    if (listRef.current) {
      listRef.current.style.overflowY = "auto";
      listRef.current.style.height = "100%";
    }

    const selectedItem = container.querySelector(
      `[data-index="${selectedIndex}"]`,
    ) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;

      if (process.env.NODE_ENV === "development") {
        console.log(
          `Item position: top=${itemTop}, bottom=${itemBottom}, containerScrollTop=${containerScrollTop}, containerHeight=${containerHeight}`,
        );
      }

      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
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
    <div
      className={`relative w-[500px] scroll-list-container ${className}`}
      style={{ maxHeight: `${maxHeight}px`, height: `${maxHeight}px` }}
    >
      {/* Контейнер фиксированной высоты для гарантии работы скролла */}
      <div
        className="scroll-list-inner"
        style={{
          width: "100%",
          height: `${maxHeight}px`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          ref={listRef}
          className={`p-4 custom-scrollable-container ${displayScrollbar ? "show-scrollbar" : "hide-scrollbar"}`}
          onScroll={handleScroll}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
            overflowY: "auto",
            display: "block",
            willChange: "transform",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {items.map((item, index) => (
            <AnimatedItem
              key={index}
              delay={0.1}
              index={index}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => {
                setSelectedIndex(index);
                if (onItemSelect) {
                  onItemSelect(item, index);
                }
              }}
            >
              <div
                className={`p-4 bg-[#111] rounded-lg transition-colors list-item ${selectedIndex === index ? "selected-item bg-[#222]" : ""} ${itemClassName}`}
                style={{ width: "100%", display: "block", marginBottom: "8px" }}
              >
                <p
                  className="text-white m-0 truncate-text"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordBreak: "break-word",
                  }}
                >
                  {item}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[50px] bg-gradient-to-b from-[#060606] to-transparent transition-opacity duration-300 ease top-gradient"
            style={{
              opacity: topGradientOpacity,
              pointerEvents: "none",
              zIndex: 20,
            }}
          ></div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#060606] to-transparent transition-opacity duration-300 ease bottom-gradient"
            style={{
              opacity: bottomGradientOpacity,
              pointerEvents: "none",
              zIndex: 20,
            }}
          ></div>
        </>
      )}
    </div>
  );
};

export default ScrollList;
