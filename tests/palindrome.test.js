const { palindrome } = require('../utils/for_testing.js')

test('palindrome of echedev', () => {
	const result = palindrome('echedev')

	expect(result).toBe('vedehce')
})

test('palindrome of empty string', () => {
	const result = palindrome('')

	expect(result).toBe('')
})

test('palindrome of undefined', () => {
	const result = palindrome()

	expect(result).toBeUndefined()
})