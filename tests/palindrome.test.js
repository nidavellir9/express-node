const { palindrome } = require('../utils/for_testing.js')

test.skip('palindrome of echedev', () => {
	const result = palindrome('echedev')

	expect(result).toBe('vedehce')
})

test.skip('palindrome of empty string', () => {
	const result = palindrome('')

	expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
	const result = palindrome()

	expect(result).toBeUndefined()
})