import 'react-native';
import { beautifyNumber } from "../utils/number";

it("Function beautifyNumber should not render K for amount lower than 10000", () => {
    expect(beautifyNumber(1000)).toBe(1000);
    expect(beautifyNumber(9999)).toBe(9999);
    expect(beautifyNumber(100)).toBe(100);
    expect(beautifyNumber(999)).toBe(999);
    expect(beautifyNumber(1)).toBe(1);
    expect(beautifyNumber(2434)).toBe(2434);
    expect(beautifyNumber(2434, "$")).toBe("$2,434.00");
    expect(beautifyNumber(1000, "$")).toBe("$1,000.00");
})

it("Function beautifyNumber should render K for amount more than 10000", () => {
    expect(beautifyNumber(10000)).toBe("10K");
    expect(beautifyNumber(20000)).toBe("20K");
    expect(beautifyNumber(30000)).toBe("30K");
    expect(beautifyNumber(40000)).toBe("40K");
    expect(beautifyNumber(50000)).toBe("50K");
    expect(beautifyNumber(11134)).toBe("11.13K");
    expect(beautifyNumber(44671)).toBe("44.67K");
    expect(beautifyNumber(99999)).toBe("100K");
    expect(beautifyNumber(999999)).toBe("1000K");
    expect(beautifyNumber(999999, "$")).toBe("$1,000.00K");
})

it("Function beautifyNumber should render M for amount more than 1000000", () => {
    expect(beautifyNumber(1000000)).toBe("1M");
    expect(beautifyNumber(2000000)).toBe("2M");
    expect(beautifyNumber(3000000)).toBe("3M");
    expect(beautifyNumber(4000000)).toBe("4M");
    expect(beautifyNumber(5000000)).toBe("5M");
    expect(beautifyNumber(5000000, "$")).toBe("$5.00M");
})