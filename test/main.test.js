/**
 * @jest-environment jsdom
 */

const { bankersRound } = require('../scripts/main.js');

it ("Should round properly", () => {
	expect(bankersRound(10.5)).toBe(10);
});