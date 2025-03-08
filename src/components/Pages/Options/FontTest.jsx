import { loggerStore as logger } from "@stores/logger.js";
import { uiStore as ui } from "@stores/ui.js";
import { Box, Autocomplete } from "@mantine/core";
import { fontFamilies } from "@styles/fontFamilies.js";
import { FontGrid } from "./FontGrid.jsx";
import FontScanner from "./FontScanner.jsx";

const optionsFilter = ({ options, search }) => {
  const splittedSearch = search.toLowerCase().trim().split(" ");
  return (options || []).filter((option) => {
    const words = option.label.toLowerCase().trim().split(" ");
    return splittedSearch.every((searchWord) =>
      words.some((word) => word.includes(searchWord)),
    );
  });
};

// const ff=fontFamilies.slice(0, 10);
// logger.warning("FontTestInit", JSON.stringify(fontFamilies));
ui.setFontFamilies([...fontFamilies]);

export const FontTest = () => {
  return (
    <Box>
      {/*<FontScanner />*/}
      <Autocomplete
        label="Шрифты"
        mb="lg"
        placeholder="Поиск шрифта"
        data={fontFamilies}
        filter={optionsFilter}
        onChange={(value) => ui.setFontSearch(value)}
      />
      <FontGrid />
    </Box>
  );
};
