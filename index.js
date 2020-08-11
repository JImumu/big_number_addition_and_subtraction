const trim = str => {
    return str.replace(/\s/g, '')
}

const bigNumberAddOrSub = (num1, num2, addOrSub = 'add') => {
    num1 = trim('' + num1)
    num2 = trim('' + num2)

    if (num1.indexOf('-') === 0 && addOrSub === 'add') {
        return bigNumberAddOrSub(num2, num1.slice(1), 'sub')
    } else if (num1.indexOf('-') === 0 && addOrSub === 'sub') {
        return ('-' + bigNumberAddOrSub(num1.slice(1), num2, 'add')).replace('--', '')
    }

    if (num2.indexOf('-') === 0 && addOrSub === 'add') {
        return bigNumberAddOrSub(num1, num2.slice(1), 'sub')
    } else if (num2.indexOf('-') === 0 && addOrSub === 'sub') {
        return bigNumberAddOrSub(num1, num2.slice(1), 'add')
    }

    const num1Obj = {
        integer: num1.split('.')[0] || '',
        decimal: num1.split('.')[1] || ''
    }
    const num2Obj = {
        integer: num2.split('.')[0] || '',
        decimal: num2.split('.')[1] || ''
    }

    num1Obj.integerArr = num1Obj.integer ? num1Obj.integer.split('') : []
    num1Obj.decimalArr = num1Obj.decimal ? num1Obj.decimal.split('') : []
    num2Obj.integerArr = num2Obj.integer ? num2Obj.integer.split('') : []
    num2Obj.decimalArr = num2Obj.decimal ? num2Obj.decimal.split('') : []
    num1Obj.integerArr.reverse()
    num2Obj.integerArr.reverse()

    const integerLen = Math.max(num1Obj.integerArr.length, num2Obj.integerArr.length)
    const decimalLen = Math.max(num1Obj.decimalArr.length, num2Obj.decimalArr.length)
    let tenPosition = 0

    let decimalResArr = []
    for (let i = decimalLen - 1; i >= 0; i--) {
        let res = 0
        let individualPosition = 0
        if (addOrSub === 'add') {
            res = Number(num1Obj.decimalArr[i] || 0) + Number(num2Obj.decimalArr[i] || 0) + tenPosition
            individualPosition = res % 10
            tenPosition = res >= 10 ? 1 : 0
        } else {
            res = Number(num1Obj.decimalArr[i] || 0) - Number(num2Obj.decimalArr[i] || 0)

            if (res < 0) {
                let jiewei = false
                for (let j = i - 1; j >= 0 && !jiewei; j--) {
                    jiewei = +num1Obj.decimalArr[j] > 0
                    if (jiewei) {
                        num1Obj.decimalArr[j] = num1Obj.decimalArr[j] - 1
                        for (let k = j + 1; k <= i; k++) {
                            num1Obj.decimalArr[k] = 9
                        }
                    }
                }
                for (let j = 0; j < integerLen && !jiewei; j++) {
                    jiewei = +num1Obj.integerArr[j] > 0
                    if (jiewei) {
                        num1Obj.integerArr[j] = num1Obj.integerArr[j] - 1
                        for (let k = j - 1; k >= 0; k--) {
                            num1Obj.integerArr[k] = 9
                        }
                        for (let k = i - 1; k >= 0; k--) {
                            num1Obj.decimalArr[k] = 9
                        }
                    }
                }

                if (jiewei) {
                    individualPosition = 10 + res
                    tenPosition = -1
                } else {
                    return ('-' + bigNumberAddOrSub(num2, num1, 'sub')).replace('--', '')
                }

            } else {
                individualPosition = res
                tenPosition = 0
            }
        }
        decimalResArr.unshift(individualPosition)
    }

    let integerResArr = []
    for (let i = 0; i < integerLen; i++) {
        let res = 0
        let individualPosition = 0
        if (addOrSub === 'add') {
            res = Number(num1Obj.integerArr[i] || 0) + Number(num2Obj.integerArr[i] || 0) + tenPosition
            individualPosition = res % 10
            tenPosition = res >= 10 ? 1 : 0
        } else {
            res = Number(num1Obj.integerArr[i] || 0) - Number(num2Obj.integerArr[i] || 0)

            if (res < 0) {
                let jiewei = false
                for (let j = i + 1; j < integerLen && !jiewei; j++) {
                    jiewei = +num1Obj.integerArr[j] > 0
                    num1Obj.integerArr[j] = num1Obj.integerArr[j] - 1
                    if (jiewei) {
                        for (let k = j - 1; k > i; k--) {
                            num1Obj.integerArr[k] = 9
                        }
                    }
                }
                if (jiewei) {
                    individualPosition = 10 + res
                    tenPosition = -1
                } else {
                    return ('-' + bigNumberAddOrSub(num2, num1, 'sub')).replace('--', '')
                }
            } else {
                individualPosition = res
                tenPosition = 0
            }
        }
        integerResArr.push(individualPosition)
    }
    if (tenPosition > 0) {
       integerResArr.push(1)
    } 
    integerResArr.reverse()

    let integer = integerResArr.join('').replace(/^0+/g, '') || '0'
    let decimal = decimalResArr.join('').replace(/0+$/g, '')

    return decimal ? (integer + '.' + decimal) : integer

}


const a = '2.01'
const b = '1111111111'

console.log(bigNumberAddOrSub(a, b, 'sub'))
