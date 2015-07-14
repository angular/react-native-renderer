var nextTag = 1;
module.exports = {
	allocateTag: function() {
		if (nextTag % 10 === 1) nextTag++;
		return nextTag++;
	}
}