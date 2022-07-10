export const errors = () => {
	process.on(`uncaughtException`, (err) => {
		console.error(err);
	});
};
