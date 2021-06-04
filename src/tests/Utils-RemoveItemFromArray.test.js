import { RemoveItemFromArray } from '../utils/ArrayUtils';

const test_array = ['test1', 'test2', 'test3', 'test4', 'test5'];

describe('remove correct item', ()=> {
    test('passed in index removes item and returns correct array', () => {
        const expected = ['test1', 'test2', 'test4', 'test5'];

        const results = RemoveItemFromArray(test_array, 2);

        for (let i = 0; i < expected.length; i++) {
            expect(results[i]).toBe(expected[i]);

        }
        expect(results).not.toStrictEqual(test_array);
    });
});

describe('properly deal with errors', ()=> {
    test('passed in index of -1 returns -1 for error', () => {
        const expected = -1;

        const results = RemoveItemFromArray(test_array, -1);

        expect(results).toBe(expected);
    });

    test('passed in index of 200 returns -1 for error', () => {
        const expected = -1;

        const results = RemoveItemFromArray(test_array, 200);

        expect(results).toBe(expected);
    });

    test('passed in undefined array returns -1 for error', () => {
        const expected = -1;

        const results = RemoveItemFromArray(undefined, 1);

        expect(results).toBe(expected);
    });
});