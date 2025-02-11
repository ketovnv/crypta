
import { IconSearch } from '@tabler/icons-react';
import { createSpotlight, Spotlight } from '@mantine/spotlight';

export const [searchStore, searchHandlers] = createSpotlight();

export function Search({ data }: { data: any[] }) {


  // const actions = data?.map((item) => ({
  //   id: item.component,
  //   label: item.component,
  //   description: item.attributes.title,
  //   onClick: () => router.push(`/component/${item.slug}`),
  // }));

  return (
    <Spotlight
      store={searchStore}
      shortcut={['mod + K', 'mod + P', '/']}
       actions={[]}
      tagsToIgnore={[]}
      highlightQuery
      clearQueryOnClose
      radius="md"
      limit={7}
      nothingFound="Nothing found..."
      searchProps={{
        leftSection: <IconSearch size={20} />,
        placeholder: 'Search components...',
      }}
    />
  );
}
