function Point(x, y) {
    this.x = 0;
    this.y = 0;
    if (x !== undefined) {
        this.x = x;
        this.y = y;
    }
}

Point.prototype.add = function (that) {
    return new Point(this.x + that.x, this.y + that.y);
}

Point.prototype.subtract = function (that) {
    return new Point(this.x - that.x, this.y - that.y);
};

Point.prototype.angle = function (that) {
    //Angle between points in radians
    return Math.atan2((this.y - that.y), (this.x - that.x)) + Math.PI;
}

Point.prototype.clone = function () {
    return new Point(this.x, this.y);
};

Point.prototype.distance = function (that) {
    return Math.sqrt((this.x - that.x) * (this.x - that.x) + (this.y - that.y) * (this.y - that.y))
}

Point.prototype.dot = function (that) {
    return this.x * that.x + this.y * that.y;
};

Point.prototype.rotate = function (centre, angle) {
    var x = centre.x + (this.x - centre.x) * Math.cos(angle) - (this.y - centre.y) * Math.sin(angle);
    var y = centre.y + (this.x - centre.x) * Math.sin(angle) + (this.y - centre.y) * Math.cos(angle);
    return new Point(x, y)
}

Point.prototype.min = function (that) {
    return new Point(
        Math.min(this.x, that.x),
        Math.min(this.y, that.y)
    );
};

Point.prototype.max = function (that) {
    return new Point(
        Math.max(this.x, that.x),
        Math.max(this.y, that.y)
    );
};

Point.prototype.lerp = function (that, t) {
    return new Point(
        this.x + (that.x - this.x) * t,
        this.y + (that.y - this.y) * t
    );
};

Point.fromPoints = function (p1, p2) {
    return new Point(
        p2.x - p1.x,
        p2.y - p1.y
    );
};
