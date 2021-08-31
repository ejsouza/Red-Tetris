const parseUrlWithHash = (url: string): string[] => {
  if (!url.includes('#')) {
    return [];
  }
  const game = url.match(/\/#([a-z]+)/gi)![0].slice(2);
  const player = url.match(/\[([a-z]+)/gi)![0].slice(1);

  return [game, player];
};

export default parseUrlWithHash;
