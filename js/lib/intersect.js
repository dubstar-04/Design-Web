/*****
*
*   Intersection.js
*
*   Based on work Intersection.js Kevin Lindsey
*   additions by Daniel Wood 2016, 2017, 2018
*****/


function Intersection(status) {
    if ( arguments.length > 0 ) {
        this.init(status);
    }
}

Intersection.prototype.init = function(status) {
    this.status = status;
    this.points = new Array();
};

Intersection.prototype.appendPoint = function(point) {
    this.points.push(point);
};

Intersection.prototype.appendPoints = function(points) {
    this.points = this.points.concat(points);
};

Intersection.intersectCircleEllipse = function(cc, r, ec, rx, ry) {
    return Intersection.intersectEllipseEllipse(cc, r, r, ec, rx, ry);
};


/*****
*
*   intersectCircleLine
*
*****/
Intersection.intersectCircleLine = function(circle, line, extend) {

    var c = circle.centre
    var r = circle.radius
    var a1 = line.start
    var a2 = line.end
    extend = extend || false


    var result;
    var a  = (a2.x - a1.x) * (a2.x - a1.x) +
            (a2.y - a1.y) * (a2.y - a1.y);
    var b  = 2 * ( (a2.x - a1.x) * (a1.x - c.x) +
                  (a2.y - a1.y) * (a1.y - c.y)   );
    var cc = c.x*c.x + c.y*c.y + a1.x*a1.x + a1.y*a1.y -
            2 * (c.x * a1.x + c.y * a1.y) - r*r;
    var deter = b*b - 4*a*cc;

    if ( deter < 0 ) {
        result = new Intersection("Outside");
    } else if ( deter == 0 ) {
        result = new Intersection("Tangent");
        // NOTE: should calculate this point
    } else {
        var e  = Math.sqrt(deter);
        var u1 = ( -b + e ) / ( 2*a );
        var u2 = ( -b - e ) / ( 2*a );

        if ( (u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1) ) {
            if ( (u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1) ) {
                result = new Intersection("Outside");
                if (extend){
                    result.points.push( a1.lerp(a2, u1) );
                    result.points.push( a1.lerp(a2, u2) );
                }
            } else {
                result = new Intersection("Inside");
                if (extend){
                    result.points.push( a1.lerp(a2, u1) );
                    result.points.push( a1.lerp(a2, u2) );
                }
            }
        } else {
            result = new Intersection("Intersection");

            if ( 0 <= u1 && u1 <= 1 || extend)
                result.points.push( a1.lerp(a2, u1) );

            if ( 0 <= u2 && u2 <= 1 || extend)
                result.points.push( a1.lerp(a2, u2) );
        }
    }

    return result;
};


/*****
*
*   intersectLineCircle
*
*****/
Intersection.intersectLineCircle = function(line, circle, extend) {

    return Intersection.intersectCircleLine(circle, line, extend)

}


/*****
*
*   intersectCircleCircle
*
*****/
Intersection.intersectCircleCircle = function(circle1, circle2, extend) {

    var c1 = circle1.centre
    var r1 = circle1.radius
    var c2 = circle2.centre
    var r2 = circle2.radius
    var result;

    // Determine minimum and maximum radii where circles can intersect
    var r_max = r1 + r2;
    var r_min = Math.abs(r1 - r2);

    // Determine actual distance between circle circles
    var c_dist = c1.distance( c2 );

    if ( c_dist > r_max ) {
        result = new Intersection("Outside");
    } else if ( c_dist < r_min ) {
        result = new Intersection("Inside");
    } else {
        result = new Intersection("Intersection");

        var a = (r1*r1 - r2*r2 + c_dist*c_dist) / ( 2*c_dist );
        var h = Math.sqrt(r1*r1 - a*a);
        var p = c1.lerp(c2, a/c_dist);
        var b = h / c_dist;

        result.points.push(
            new Point(
                p.x - b * (c2.y - c1.y),
                p.y + b * (c2.x - c1.x)
            )
        );
        result.points.push(
            new Point(
                p.x + b * (c2.y - c1.y),
                p.y - b * (c2.x - c1.x)
            )
        );
    }

    return result;
};


/*****
*
*   intersectCirclePolygon
*
*****/
Intersection.intersectCirclePolygon = function(c, r, points) {
    var result = new Intersection("No Intersection");
    var length = points.length;
    var inter;

    for ( var i = 0; i < length; i++ ) {
        var a1 = points[i];
        var a2 = points[(i+1) % length];

        inter = Intersection.intersectCircleLine(c, r, a1, a2);
        result.appendPoints(inter.points);
    }

    if ( result.points.length > 0 )
        result.status = "Intersection";
    else
        result.status = inter.status;

    return result;
};

/*****
*
*   intersectArcRectangle
*
*****/
Intersection.intersectArcRectangle = function(arc, rectangle, extend){

    var c = arc.centre;
    var r = arc.radius;
    var sa = arc.startAngle;
    var ea = arc.endAngle;
    var r1 = rectangle.start;
    var r2 = rectangle.end;

    var min        = r1.min(r2);
    var max        = r1.max(r2);
    var topRight   = new Point( max.x, min.y );
    var bottomLeft = new Point( min.x, max.y );


    var rectPoints = {start: min, end: topRight}
    var inter1 = Intersection.intersectArcLine(arc, rectPoints, extend);

    rectPoints = {start: topRight, end: max}
    var inter2 = Intersection.intersectArcLine(arc, rectPoints, extend);

    rectPoints = {start: max, end: bottomLeft}
    var inter3 = Intersection.intersectArcLine(arc, rectPoints, extend);

    rectPoints = {start: bottomLeft, end: min}
    var inter4 = Intersection.intersectArcLine(arc, rectPoints, extend);

    var result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);

    if ( result.points.length > 0 )
        result.status = "Intersection";
    else
        result.status = inter1.status;

    return result;
}

/*****
*
*   intersectArcLine
*
*****/
Intersection.intersectArcLine = function(arc, line, extend){

    var c = arc.centre;
    var r = arc.radius;
    var sa = arc.startAngle;
    var ea = arc.endAngle;

    var inter1 = Intersection.intersectCircleLine(arc, line, extend);
    var result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);


    if(!extend){
        var points = [];

        for(var i = 0; i < result.points.length; i++){
            if(c.angle(result.points[i]) > sa && c.angle(result.points[i]) < ea){
                //console.log("(Intersection.intersectArcRectangle) [STATUS] point found")
                console.log("Angles: " + c.angle(result.points[i]) + " Start: " + sa + " End: " + ea)

                //result.points.splice(i, 1);
                points.push(result.points[i])
            }
        }

        if (points.length > 0 ){
            console.log("Actual points: " + points.length)
            result.status = "Intersection";
            points = [];
        }
    }

    return result;

}

/*****
*
*   intersectLineArc
*
*****/
Intersection.intersectLineArc = function(line, arc, extend){

    var c = arc.centre;
    var r = arc.radius;
    var sa = arc.startAngle;
    var ea = arc.endAngle;

    var inter1 = Intersection.intersectCircleLine(arc, line);
    var result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);


    if(!extend){
        var points = [];

        for(var i = 0; i < result.points.length; i++){
            if(c.angle(result.points[i]) > sa && c.angle(result.points[i]) < ea){
                //console.log("(Intersection.intersectArcRectangle) [STATUS] point found")
                console.log("Angles: " + c.angle(result.points[i]) + " Start: " + sa + " End: " + ea)

                //result.points.splice(i, 1);
                points.push(result.points[i])
            }
        }

        if (points.length > 0 ){
            console.log("Actual points: " + points.length)
            result.status = "Intersection";
            points = [];
        }
    }

    return result;

}

/*****
*
*   intersectLineArc
*
*****/
Intersection.intersectCircleArc = function(circle, arc, extend){

    var c = arc.centre;
    var r = arc.radius;
    var sa = arc.startAngle;
    var ea = arc.endAngle;

    var inter1 = Intersection.intersectCircleCircle(circle, arc, extend);
    var result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);


    if(!extend){
        var points = [];

        for(var i = 0; i < result.points.length; i++){
            if(c.angle(result.points[i]) > sa && c.angle(result.points[i]) < ea){
                //console.log("(Intersection.intersectArcRectangle) [STATUS] point found")
                console.log("Angles: " + c.angle(result.points[i]) + " Start: " + sa + " End: " + ea)

                //result.points.splice(i, 1);
                points.push(result.points[i])
            }
        }

        if (points.length > 0 ){
            console.log("Actual points: " + points.length)
            result.status = "Intersection";
            points = [];
        }
    }

    return result;
}

Intersection.intersectArcCircle = function(arc, circle, extend){

    return Intersection.intersectCircleArc(circle, arc, extend)

}


/*****
*
*   intersectCircleRectangle
*
*****/
Intersection.intersectCircleRectangle = function(circle, rectangle, extend) {

    // var c = circle.centre
    // var r = circle.radius
    var r1 = rectangle.start
    var r2 = rectangle.end
    extend = extend || false

    var min        = r1.min(r2);
    var max        = r1.max(r2);
    var topRight   = new Point( max.x, min.y );
    var bottomLeft = new Point( min.x, max.y );

    var rectPoints = {start: min, end: topRight}
    var inter1 = Intersection.intersectCircleLine(circle, rectPoints);

    rectPoints = {start: topRight, end: max}
    var inter2 = Intersection.intersectCircleLine(circle, rectPoints);

    rectPoints = {start: max, end: bottomLeft}
    var inter3 = Intersection.intersectCircleLine(circle, rectPoints);

    rectPoints = {start: bottomLeft, end: min}
    var inter4 = Intersection.intersectCircleLine(circle, rectPoints);

    var result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);

    if ( result.points.length > 0 )
        result.status = "Intersection";
    else
        result.status = inter1.status;

    return result;
};


/*****
*
*   intersectEllipseEllipse
*
*   This code is based on MgcIntr2DElpElp.cpp written by David Eberly.  His
*   code along with many other excellent examples are avaiable at his site:
*   http://www.magic-software.com
*
*   NOTE: Rotation will need to be added to this function
*
*****/
Intersection.intersectEllipseEllipse = function(c1, rx1, ry1, c2, rx2, ry2) {
    var a = [
                ry1*ry1, 0, rx1*rx1, -2*ry1*ry1*c1.x, -2*rx1*rx1*c1.y,
                ry1*ry1*c1.x*c1.x + rx1*rx1*c1.y*c1.y - rx1*rx1*ry1*ry1
            ];
    var b = [
                ry2*ry2, 0, rx2*rx2, -2*ry2*ry2*c2.x, -2*rx2*rx2*c2.y,
                ry2*ry2*c2.x*c2.x + rx2*rx2*c2.y*c2.y - rx2*rx2*ry2*ry2
            ];

    var yPoly   = Intersection.bezout(a, b);
    var yRoots  = yPoly.getRoots();
    var epsilon = 1e-3;
    var norm0   = ( a[0]*a[0] + 2*a[1]*a[1] + a[2]*a[2] ) * epsilon;
    var norm1   = ( b[0]*b[0] + 2*b[1]*b[1] + b[2]*b[2] ) * epsilon;
    var result  = new Intersection("No Intersection");

    for ( var y = 0; y < yRoots.length; y++ ) {
        var xPoly = new Polynomial(
                    a[0],
                    a[3] + yRoots[y] * a[1],
                    a[5] + yRoots[y] * (a[4] + yRoots[y]*a[2])
                    );
        var xRoots = xPoly.getRoots();

        for ( var x = 0; x < xRoots.length; x++ ) {
            var test =
                    ( a[0]*xRoots[x] + a[1]*yRoots[y] + a[3] ) * xRoots[x] +
                    ( a[2]*yRoots[y] + a[4] ) * yRoots[y] + a[5];
            if ( Math.abs(test) < norm0 ) {
                test =
                        ( b[0]*xRoots[x] + b[1]*yRoots[y] + b[3] ) * xRoots[x] +
                        ( b[2]*yRoots[y] + b[4] ) * yRoots[y] + b[5];
                if ( Math.abs(test) < norm1 ) {
                    result.appendPoint( new Point( xRoots[x], yRoots[y] ) );
                }
            }
        }
    }

    if ( result.points.length > 0 ) result.status = "Intersection";

    return result;
};



/*****
*
*   intersectEllipseLine
*
*   Rotation calculations added by Daniel Wood
*
*****/

Intersection.intersectEllipseLine = function(ellipse, line, extend){


    var c = ellipse.centre;
    var rx = ellipse.radiusX;
    var ry = ellipse.radiusY;
    var a1 = line.start;
    var a2 = line.end
    var theta = ellipse.theta;

    if(theta){
        //If theta > 0 then the ellipse is rotated.
        //Its too complicated to do a quadratic equation with a rotated ellipse so we will rotate the lines too and pretend nothing is rotated :)
        a1 = a1.rotate(c, theta)
        a2 = a2.rotate(c, theta)
    }

    var result;
    var origin = new Point(a1.x, a1.y);
    var dir    = Point.fromPoints(a1, a2);
    var center = new Point(c.x, c.y);
    var diff   = origin.subtract(center);
    var mDir   = new Point( dir.x/(rx*rx),  dir.y/(ry*ry)  );
    var mDiff  = new Point( diff.x/(rx*rx), diff.y/(ry*ry) );

    //Calculate the quadratic parameters
    var a = dir.dot(mDir);
    var b = dir.dot(mDiff);
    var c = diff.dot(mDiff) - 1.0;
    //Calculate the discriminant
    var d = b*b - a*c;

    if ( d < 0 ) {
        result = new Intersection("Outside");
    } else if ( d > 0 ) {
        var root = Math.sqrt(d);
        var t_a  = (-b - root) / a;
        var t_b  = (-b + root) / a;

        if ( (t_a < 0 || 1 < t_a) && (t_b < 0 || 1 < t_b) ) {
            if ( (t_a < 0 && t_b < 0) || (t_a > 1 && t_b > 1) ){
                result = new Intersection("Outside");
                if (extend){
                    result.appendPoint( a1.lerp(a2, t_a) );
                    result.appendPoint( a1.lerp(a2, t_b) );
                }
            }else{
                result = new Intersection("Inside");
                if (extend){
                    result.appendPoint( a1.lerp(a2, t_a) );
                    result.appendPoint( a1.lerp(a2, t_b) );
                }

            }
        } else {
            result = new Intersection("Intersection");
            if ( 0 <= t_a && t_a <= 1 )
                result.appendPoint( a1.lerp(a2, t_a) );
            if ( 0 <= t_b && t_b <= 1 )
                result.appendPoint( a1.lerp(a2, t_b) );
        }
    } else {
        var t = -b/a;
        if ( 0 <= t && t <= 1 ) {
            result = new Intersection("Intersection");
            result.appendPoint( a1.lerp(a2, t) );
        } else {
            result = new Intersection("Outside");
        }
    }

    if(theta && result.points.length){
        //If theta > 0 then rotate all the points back to their proper place
        for(var i =0; i < result.points.length; i++){

            result.points[i] = result.points[i].rotate(ellipse.centre, -theta)
        }
    }

    return result;
};

/*****
*
*   intersectEllipsePolygon
*
*****/
Intersection.intersectEllipsePolygon = function(c, rx, ry, points) {
    var result = new Intersection("No Intersection");
    var length = points.length;

    for ( var i = 0; i < length; i++ ) {
        var b1 = points[i];
        var b2 = points[(i+1) % length];
        var inter = Intersection.intersectEllipseLine(c, rx, ry, b1, b2);

        result.appendPoints(inter.points);
    }

    if ( result.points.length > 0 )
        result.status = "Intersection";

    return result;
};


/*****
*
*   intersectEllipseRectangle
*
*****/
Intersection.intersectEllipseRectangle = function(ellipse, rectangle, extend) {

    var r1 = rectangle.start;
    var r2 = rectangle.end;
    extend = extend || false

    var min        = r1.min(r2);
    var max        = r1.max(r2);
    var topRight = new Point( max.x, min.y );
    var bottomLeft = new Point( min.x, max.y );

    var rectPoints = {start: min, end: topRight}
    var inter1 = Intersection.intersectEllipseLine(ellipse, rectPoints);

    rectPoints = {start: topRight, end: max}
    var inter2 = Intersection.intersectEllipseLine(ellipse, rectPoints);

    rectPoints = {start: max, end: bottomLeft}
    var inter3 = Intersection.intersectEllipseLine(ellipse, rectPoints);

    rectPoints = {start: bottomLeft, end: min}
    var inter4 = Intersection.intersectEllipseLine(ellipse, rectPoints);

    //var inter1 = Intersection.intersectEllipseLine(c, rx, ry, min, topLeft,theta, Scene);  //<-- Whats the Scene for? can it be removed?
    //var inter2 = Intersection.intersectEllipseLine(c, rx, ry, topLeft, max, theta, Scene);
    //var inter3 = Intersection.intersectEllipseLine(c, rx, ry, max, bottomRight, theta, Scene);
    //var inter4 = Intersection.intersectEllipseLine(c, rx, ry, bottomRight, min, theta, Scene);

    var result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);

    if ( result.points.length > 0 )
        result.status = "Intersection";

    return result;
};


/*****
*
*   intersectLineLine
*
*****/
Intersection.intersectLineLine = function(line1, line2, extend) {

    var a1 = line1.start;
    var a2 = line1.end;
    var b1 = line2.start;
    var b2 = line2.end;
    extend = extend || false

    var result;

    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if ( u_b != 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        if ( (0 <= ua && ua <= 1) && (0 <= ub && ub <= 1) || (0 <= ua && ua <= 1) && extend ) {

            result = new Intersection("Intersection");
            result.points.push(
                        new Point(
                            a1.x + ua * (a2.x - a1.x),
                            a1.y + ua * (a2.y - a1.y)
                            )
                        );
        } else {
            result = new Intersection("No Intersection");
        }
    } else {
        if ( ua_t == 0 || ub_t == 0 ) {
            result = new Intersection("Coincident");
        } else {
            result = new Intersection("Parallel");
        }
    }

    return result;
};

/*****
*
*   intersectPolyLineLine
*
*****/
Intersection.intersectPolylineLine = function(polyline, line, extend) {
    var result = new Intersection("No Intersection");
    var length = polyline.points.length;

    //console.log("Intersect.js - polyline length:", length)

    for ( var i = 0; i < length; i++ ) {
        var b1 = polyline.points[i];
        var b2 = polyline.points[(i+1) % length];

        var line2 = {start: b1, end: b2}
        var inter = Intersection.intersectLineLine(line2, line, extend);

        result.appendPoints(inter.points);
    }

    if ( result.points.length > 0 ) result.status = "Intersection";
    return result;
};


/*****
*
*   intersectLineRectangle
*
*****/
Intersection.intersectPolylineRectangle = function(polyline, rectangle, extend) {
    var r1 = rectangle.start;
    var r2 = rectangle.end;
    extend = extend || false

    var min        = r1.min(r2);
    var max        = r1.max(r2);
    var topRight   = new Point( max.x, min.y );
    var bottomLeft = new Point( min.x, max.y );

    var rectPoints = {start: min, end: topRight}
    var inter1 = Intersection.intersectPolylineLine(polyline, rectPoints, extend);

    rectPoints = {start: topRight, end: max}
    var inter2 = Intersection.intersectPolylineLine(polyline, rectPoints, extend);

    rectPoints = {start: max, end: bottomLeft}
    var inter3 = Intersection.intersectPolylineLine(polyline, rectPoints, extend);

    rectPoints = {start: bottomLeft, end: min}
    var inter4 = Intersection.intersectPolylineLine(polyline, rectPoints, extend);

    var result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);

    if ( result.points.length > 0 )
        result.status = "Intersection";

    return result;
};


/*****
*
*   intersectLineRectangle
*
*****/
Intersection.intersectLineRectangle = function(line, rectangle, extend) {
    var r1 = rectangle.start;
    var r2 = rectangle.end;
    extend = extend || false

    var min        = r1.min(r2);
    var max        = r1.max(r2);
    var topRight   = new Point( max.x, min.y );
    var bottomLeft = new Point( min.x, max.y );

    var rectPoints = {start: min, end: topRight}
    var inter1 = Intersection.intersectLineLine(rectPoints, line, extend);

    rectPoints = {start: topRight, end: max}
    var inter2 = Intersection.intersectLineLine(rectPoints, line, extend);

    rectPoints = {start: max, end: bottomLeft}
    var inter3 = Intersection.intersectLineLine(rectPoints, line, extend);

    rectPoints = {start: bottomLeft, end: min}
    var inter4 = Intersection.intersectLineLine(rectPoints, line, extend);

    var result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);

    if ( result.points.length > 0 )
        result.status = "Intersection";

    return result;
};

Intersection.intersectRectangleLine = function(rectangle, line, extend) {

    console.log("intersect.js - intersectRectangleLine:", rectangle.start.x, rectangle.start.y)

    return Intersection.intersectLineRectangle(line, rectangle, extend);
}


/*****
*
*   intersectPolygonPolygon
*
*****/
Intersection.intersectPolygonPolygon = function(points1, points2) {
    var result = new Intersection("No Intersection");
    var length = points1.length;

    for ( var i = 0; i < length; i++ ) {
        var a1 = points1[i];
        var a2 = points1[(i+1) % length];
        var inter = Intersection.intersectLinePolygon(a1, a2, points2);

        result.appendPoints(inter.points);
    }

    if ( result.points.length > 0 )
        result.status = "Intersection";

    return result;

};


/*****
*
*   intersectPolygonRectangle
*
*****/
Intersection.intersectPolygonRectangle = function(points, r1, r2) {
    var min        = r1.min(r2);
    var max        = r1.max(r2);
    var topRight   = new Point( max.x, min.y );
    var bottomLeft = new Point( min.x, max.y );

    var inter1 = Intersection.intersectLinePolygon(min, topRight, points);
    var inter2 = Intersection.intersectLinePolygon(topRight, max, points);
    var inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points);
    var inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points);

    var result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);

    if ( result.points.length > 0 )
        result.status = "Intersection";

    return result;
};


/*****
*
*   intersectRayRay
*
*****/
Intersection.intersectRayRay = function(a1, a2, b1, b2) {
    var result;

    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if ( u_b != 0 ) {
        var ua = ua_t / u_b;

        result = new Intersection("Intersection");
        result.points.push(
                    new Point(
                        a1.x + ua * (a2.x - a1.x),
                        a1.y + ua * (a2.y - a1.y)
                        )
                    );
    } else {
        if ( ua_t == 0 || ub_t == 0 ) {
            result = new Intersection("Coincident");
        } else {
            result = new Intersection("Parallel");
        }
    }

    return result;
};


/*****
*
*   intersectRectangleRectangle
*
*****/
Intersection.intersectRectangleRectangle = function(rectangle1, rectangle2, extend) {

    var a1 = rectangle1.start
    var a2 = rectangle1.end
    var b1 = rectangle2.start
    var b2 = rectangle2.end
    extend = extend || false



    var min        = a1.min(a2);
    var max        = a1.max(a2);
    var topRight   = new Point( max.x, min.y );
    var bottomLeft = new Point( min.x, max.y );

    var rectPoints = {start: min, end: topRight}
    var inter1 = Intersection.intersectLineRectangle(rectPoints, rectangle2);

    rectPoints = {start: topRight, end: max}
    var inter2 = Intersection.intersectLineRectangle(rectPoints, rectangle2);

    rectPoints = {start: max, end: bottomLeft}
    var inter3 = Intersection.intersectLineRectangle(rectPoints, rectangle2);

    rectPoints = {start: bottomLeft, end: min}
    var inter4 = Intersection.intersectLineRectangle(rectPoints, rectangle2);

    var result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);

    if ( result.points.length > 0 )
        result.status = "Intersection";

    return result;
};


