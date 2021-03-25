const parseUrlWithHash = (url: string): string[] => {
  const startSeparator = url.indexOf('[');
  const endSeparator = url.indexOf(']');
  /**
   * When url entered through the form the url starts with '/'
   * When url entered directly on the browser url starts with '#'
   */
  const startAt = url.startsWith('/') ? 2 : 1;
  const incrementStartSeparator = startAt === 2 ? 0 : 1;
  const roomName = url.slice(startAt, startSeparator);
  const userName = url.slice(startSeparator, endSeparator);
  console.log(`in parseUrl: ${roomName}--${userName}`);
  return [roomName, userName];
};

export default parseUrlWithHash;
