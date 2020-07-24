module.exports = {
	setHeroStatsValid : function (data) {
		try {
			// check correct post params count
			if (Object.keys(data).length !== 5) return responseTemplate(false, 'invalid params count');

			let {name, strength, dexterity, intellect, isInvincible} = data;
			// check correct post params values
			if ([name, strength, dexterity, intellect, isInvincible].includes(undefined)) return responseTemplate(false, 'invalid params keys');

			// check correct params names and types
			if (typeof name !== 'string') return responseTemplate(false, 'invalid name type');
			if (!strength || Number(strength) != strength) return responseTemplate(false, 'invalid strength type');
			if (!dexterity || Number(dexterity) != dexterity) return responseTemplate(false, 'invalid dexterity type');
			if (!intellect || Number(intellect) != intellect) return responseTemplate(false, 'invalid intellect type');
			if (!['true', 'false'].includes(isInvincible)) return responseTemplate(false, 'invalid isInvincible type');
				 
			return responseTemplate(true, 'save user data success');
		}
		catch (error) {
			console.log(error);
			return responseTemplate(false, 'another error');
		}
	}
}

function responseTemplate(result, text) {
	return ({result, text});
};
