const parseUrlWithHash = (url: string): string[] => {
	const path = url.startsWith('/') ? url.slice(1, url.length) : url;
  const startSeparator = path.indexOf('[');
  const endSeparator = path.indexOf(']');
  /**
   * When url entered through the form the url starts with '/'
   * When url entered directly on the browser url starts with '#'
   */
  const roomName = path.slice(1, startSeparator);
  const userName = path.slice(startSeparator + 1, endSeparator);
  return [roomName, userName];
};

export default parseUrlWithHash;
