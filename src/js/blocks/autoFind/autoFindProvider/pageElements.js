export const getPageElements = () => {
  let tagsWithJdnHash = document.querySelectorAll('[jdn-hash]');
  let jdnHashItems = [];

  Array.from(tagsWithJdnHash).forEach((tag) => {
    jdnHashItems.push({
      jdnHash: tag.attributes['jdn-hash'].value, 
      id: tag.id 
    });
  });

  return [JSON.stringify(jdnHashItems)];
};
  