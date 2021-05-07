const parseUrlWithHash = (url: string): string[] => {

  console.log(`In parseUrlWithHash (${url})`);
  if (!url.includes('#')) {
    return [];
  }
  const game = url.match(/\/#([a-z]+)/gi)![0].slice(2);
  const player = url.match(/\[([a-z]+)/gi)![0].slice(1);

  return [game, player];
};

export default parseUrlWithHash;
