/**
* 去除字符串中的非字符
* @param str 需要去除非字符的字符串
* @retrun { String } 去除结果
* @example trim('1827391 82739127391827391231231231 ')
*/
const trim = str => {
    return str.replace(/\s/g, '')
}

/**
* 大数加减
* @param num1 { String | Number } 运算符左边的数字
* @param num2 { String | Number } 运算符右边的数字
* @param addOrSub { 'add' | 'sub' } 加法或减法
* @retrun { String } 计算结果
* @example bigNumberAddOrSub('182739182739127391827391231231231', '1', 'sub')
*/
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
    // tenPosition为加法进位
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
            // 如果结果小于0则借位
            if (res < 0) {
                let jiewei = false
                // 小数位借位
                for (let j = i - 1; j >= 0 && !jiewei; j--) {
                    // 如果该位大于0，则可以借位
                    jiewei = +num1Obj.decimalArr[j] > 0
                    if (jiewei) {
                        // 被借位减一
                        num1Obj.decimalArr[j] = num1Obj.decimalArr[j] - 1
                        // 被借位与减位之间的0改为9
                        for (let k = j + 1; k <= i; k++) {
                            num1Obj.decimalArr[k] = 9
                        }
                    }
                }
                // 整数位借位
                for (let j = 0; j < integerLen && !jiewei; j++) {
                    // 如果该位大于0，则可以借位
                    jiewei = +num1Obj.integerArr[j] > 0
                    if (jiewei) {
                        // 被借位减一
                        num1Obj.integerArr[j] = num1Obj.integerArr[j] - 1
                        // 被借位与减位之间的0改为9
                        for (let k = j - 1; k >= 0; k--) {
                            num1Obj.integerArr[k] = 9
                        }
                        for (let k = i - 1; k >= 0; k--) {
                            num1Obj.decimalArr[k] = 9
                        }
                    }
                }
                if (jiewei) {
                    // 如果可以借位，则给当前位的计算结果加10
                    individualPosition = 10 + res
                } else {
                    // 无法借位则表示被减数小于减数，即a - b < 0 ，则计算b - a的结果后加上负号，a - b = - (b - a)
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

            // 如果结果小于0则借位
            if (res < 0) {
                let jiewei = false
                // 整数位借位
                for (let j = i + 1; j < integerLen && !jiewei; j++) {
                    // 如果该位大于0，则可以借位
                    jiewei = +num1Obj.integerArr[j] > 0
                    // 被借位减一
                    num1Obj.integerArr[j] = num1Obj.integerArr[j] - 1
                    // 被借位与减位之间的0改为9
                    if (jiewei) {
                        for (let k = j - 1; k > i; k--) {
                            num1Obj.integerArr[k] = 9
                        }
                    }
                }
                if (jiewei) {
                    // 如果可以借位，则给当前位的计算结果加10
                    individualPosition = 10 + res
                } else {
                    // 无法借位则表示被减数小于减数，即a - b < 0 ，则计算b - a的结果后加上负号，a - b = - (b - a)
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
