describe("photonui.DataFormatter", function () {

    describe("stringFormatter", function () {

        it("returns the input string by default", function () {
            var value = photonui.DataFormatter.stringFormatter("hello world", {}, {});
            expect(value).toBe("hello world");
        });

        it("returns the input integer as string by default", function () {
            var value = photonui.DataFormatter.stringFormatter("42", {}, {});
            expect(value).toBe("42");
        });

        it("returns the input boolean as string by default", function () {
            var value = photonui.DataFormatter.stringFormatter(true, {}, {});
            expect(value).toBe("true");
            var value2 = photonui.DataFormatter.stringFormatter(false, {}, {});
            expect(value2).toBe("false");
        });

        it("returns the formated input string", function () {
            var value = photonui.DataFormatter.stringFormatter("John", {}, {format: "hello %s"});
            expect(value).toBe("hello John");
        });

        it("returns the formated input integer as string", function () {
            var value = photonui.DataFormatter.stringFormatter(2, {}, {format: "%02i"});
            expect(value).toBe("02");
        });

        it("returns the formated input integer as hexadecimal string", function () {
            var value = photonui.DataFormatter.stringFormatter(10, {}, {format: "0x%02X"});
            expect(value).toBe("0x0A");
        });

        it("returns the formated input float as string", function () {
            var value = photonui.DataFormatter.stringFormatter(10.5, {}, {format: "%.2f"});
            expect(value).toBe("10.50");
        });

    });

    describe("dateFormatter", function () {

        it("returns a date string formatted like 'YYYY-MM-DD HH:mm:ss' by default", function () {
            var value = photonui.DataFormatter.dateFormatter(new Date(), {}, {});
            expect(value).toMatch(/^[12][0-9]{3}-(0[1-9]|1[0-2])-([0-2][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/);
        });

        it("returns a date string formatted as requested", function () {
            var value = photonui.DataFormatter.dateFormatter(new Date(), {}, {format: "DD/MM/YY HH:mm"});
            expect(value).toMatch(/^(0[1-9]|[1-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{2} ([01][0-9]|2[0-3]):[0-5][0-9]$/);
        });

    });

});

