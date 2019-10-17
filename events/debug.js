module.exports = (e) => {
  /* global process */
  if (process.env.DEBUG == true ) {
    console.info(e);
  }
};
