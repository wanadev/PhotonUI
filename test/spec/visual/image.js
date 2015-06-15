describe("photonui.Image", function() {

    beforeAll(function () {
        addTitle("photonui.Image");
    });

    beforeEach(function() {
        this.area = addTestArea();
        this.area.className += " photonui-container-expand-child";
        this.img = new photonui.Image();

        photonui.domInsert(this.img, this.area);
    });

    it("can change its image", function(done) {
        var that = this;
        this.img.__html.image.onload = function() {
            expect(parseFloat(that.img.__html.image.width)).toEqual(100);
            expect(parseFloat(that.img.__html.image.height)).toEqual(100);
            expect(that.img.__html.image.src).toMatch(/dummyimage\.png$/);

            done();
        }

        this.img.url = "./dummyimage.png";
    });

    it("can have a defined width", function(done) {
        var that = this;
        this.img.__html.image.onload = function() {
            setTimeout(function () {
                expect(parseFloat(that.img.__html.image.width)).toEqual(200);
                expect(parseFloat(that.img.__html.image.height)).toEqual(200);

                done();
            }, 100);
        }

        this.img.width = 200;
        this.img.url = "./dummyimage.png";
    });

    it("can have a defined height", function(done) {
        var that = this;
        this.img.__html.image.onload = function() {
            setTimeout(function () {
                expect(parseFloat(that.img.__html.image.width)).toEqual(200);
                expect(parseFloat(that.img.__html.image.height)).toEqual(200);

                done();
            }, 100);
        }

        this.img.height = 200;
        this.img.url = "./dummyimage.png";
    });

    it("can have both height and width defined", function(done) {
        var that = this;
        this.img.__html.image.onload = function() {
            setTimeout(function () {
                expect(parseFloat(that.img.__html.image.width)).toEqual(50);
                expect(parseFloat(that.img.__html.image.height)).toEqual(200);

                done();
            }, 100);
        }

        this.img.width = 50;
        this.img.height = 200;
        this.img.url = "./dummyimage.png";
    });

});
