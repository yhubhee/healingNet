const illness = {
    "Primary Care": [
        "Hypertension",
        "flu",
    ],

    "Internal Medicine and Subspecialties": [
        "coronary artery disease",
        "heart failure",
    ],
};

// Iterate over the keys of the illness object
for (const key in illness) {
    if (illness[key]) {
        console.log(key);
        // Use forEach on the array within the object
        illness[key].forEach(ill => console.log(ill));
    }
}

// const fruits = {
//     "primary care": ["Banana", "Orange", "Apple", "Mango"]
// };
// let fruits2 = ""
// for (const key in fruits) {
//     fruits2 += fruits[key];
// }
// console.log(fruits2);

// console.log(fruits["primary care"][0]);

const numbers = [45, 4, 9, 16, 25];

numbers.forEach(function(number) {
    console.log(number);
});

// Alternatively, using arrow function
numbers.forEach(number => console.log(number));