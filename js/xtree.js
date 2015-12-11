var XTREE = (function(ns){
    var trees;
    var magScale = 1;
    var depth = 2;
    var width;
    var height;
    var treeheight;

    var branchColor = "#117744";
    var leafColor = "#EEEEEE";
    var leafColor2 = "#EEEEEE";
    var snowColor = "#FFFFFF";
    var starColor = "#FFFF33";
    var ornColor = "#55EE55";
    var ornColor2 = "#AA1111";
    var ornColor3 = "#FFAA00";
    var ornColor4 = "#BBBBFF";
    var snowNum = 1500;
    var snowIndex = 0;
    var angleSpeed = 0.3;
    var cof = 1.0;
    var now;
    var than = Date.now();
    var fps = 60;
    var interval = 1000/fps;
    var ballSize1 = 6;
    var ballSize2 = 5;
    var ballSize3 = 2;

    function getRandom(s,f)
    {
        return Math.floor((f-s) * Math.random() + s);
    }
    function Point3D(x, y, z)
    {
        var ab = 5000*magScale;
        this.X = x;
        this.Y = y;
        this.Z = z;
        this.FlatX = function () {return ab * this.X*magScale / (ab+this.Z*magScale)+width/2 };
        this.FlatY = function () {return ab * (this.Y*magScale+height*0.8) / (ab+this.Z*magScale) + height*0.1 };
    }
    function rotateZ(p,a)
    {
        var tx, ty;
        tx = Math.cos(a*Math.PI/180) * p.X + Math.sin(a*Math.PI/180) * p.Y;
        ty = -Math.sin(a*Math.PI/180) * p.X + Math.cos(a*Math.PI/180) * p.Y;
        return new Point3D(tx,ty,p.Z);
    }
    function SnowBall()
    {
        var rad = getRandom(width*0.05, (height * 0.8)>width?width/2:(height*0.4) )/magScale;
        var t= getRandom(0,360);
        this.melt = getRandom(300,450);
        this.point = new Point3D(rad * Math.cos(t*Math.PI/180), getRandom(-treeheight*3,0), rad* Math.sin(t*Math.PI/180));
    }
    function Ornament_Ball(x,y,z)
    {
        this.rad = getRandom(6,12);
        this.point = new Point3D(x,y,z);
    }
    function Snow()
    {
        var s = [];
        var i;
        for(i=0 ; i<snowNum ; i++)
        {
            s[i] = new SnowBall();
        }
        return s;
    }
    function Star()
    {
        var s = [];
        s=s.concat(new Point3D(0, -25, 0));
        s=s.concat(new Point3D(-5, -5, 0));
        s=s.concat(new Point3D(5, -5, 0));
        var i;
        for(i=1 ; i<5 ; i++)
        {
            s[i*3] = rotateZ(s[(i-1)*3],72);
            s[i*3+1] = rotateZ(s[(i-1)*3+1],72);
            s[i*3+2] = rotateZ(s[(i-1)*3+2],72);
        }
        s=s.concat(new Point3D(0,0,7));
        s=s.concat(new Point3D(0,0,-7));
        for(i=0 ; i<17 ; i++)
        {
            s[i].Y -= treeheight-10;
        }
        return s;
    }
    function Branch(head, tail, tail2)
    {
        this.branchPoints = [head, tail, tail2];
        this.type = 0; //brach : 0 leaf : 1 leaf2 : 2
        this.rotateBranch = function(branchOrigin, theta, psi){
            var tx = 0;
            var ty = 0;
            var tz = 0;
            theta *= 0.01745329;
            psi *= 0.01745329;
            var thc = Math.cos(theta);
            var ths = Math.sin(theta);
            var psc = Math.cos(psi);
            var pss = Math.sin(psi);
            var i;
            for(i=0 ; i<3 ; i++)
            {
                tx = thc * this.branchPoints[i].X + ths * this.branchPoints[i].Y;
                ty = -ths * this.branchPoints[i].X + thc * this.branchPoints[i].Y;
                this.branchPoints[i].X = tx;
                tx = psc * this.branchPoints[i].X + pss * this.branchPoints[i].Z;
                tz = -pss * this.branchPoints[i].X + psc * this.branchPoints[i].Z;
                this.branchPoints[i].X = tx + branchOrigin.X;
                this.branchPoints[i].Y = ty + branchOrigin.Y;
                this.branchPoints[i].Z = tz;
            }
        };
    }
    function Tree(h, z, t, p, n)
    {
        this.body;
        this.z = z;
        this.theta = t;
        this.psi = p;
        this.height = h;
        this.wholeChildNum=0;
        this.childs = new Array(n);
        this.childNum = n;
    }

    function drawBranch(name, treePoints){
        var i;
        var br;
        var canvas = document.getElementById(name).getContext('2d');
        var path;
        for(i=0 ; i<treePoints.length ; i++)
        {
            br = treePoints[i].branchPoints;
            if(treePoints[i].type==1 && br[0].Z>=0)
            {
                path = new Path2D();
                path.moveTo(br[0].FlatX(),br[0].FlatY());
                path.lineTo(br[1].FlatX(),br[1].FlatY());
                path.lineTo(br[2].FlatX(),br[2].FlatY());
                canvas.fillStyle = leafColor;
                canvas.fill(path);
            }
            else if(treePoints[i].type==2 && br[0].Z>=0)
            {
                canvas.beginPath();
                rad = ballSize1 * magScale;
                canvas.arc(br[1].FlatX(), br[1].FlatY(), rad, 0, 2 * Math.PI, true);
                canvas.fillStyle = ornColor;
                canvas.fill();
            }
            else if(treePoints[i].type==3 && br[0].Z>=0)
            {
                canvas.beginPath();
                rad = ballSize2 * magScale;
                canvas.arc(br[2].FlatX(), br[2].FlatY(), rad, 0, 2 * Math.PI, true);
                canvas.fillStyle = ornColor2;
                canvas.fill();
            }
            else if(treePoints[i].type==5 && br[0].Z>=0)
            {
                path = new Path2D();
                path.moveTo(br[0].FlatX(),br[0].FlatY());
                path.lineTo(br[1].FlatX(),br[1].FlatY());
                path.lineTo(br[2].FlatX(),br[2].FlatY());
                canvas.fillStyle = leafColor2;
                canvas.fill(path);
            }
            else if(treePoints[i].type==4 && br[0].Z>=0)
            {
                path = new Path2D();
                path.moveTo(br[0].FlatX(),br[0].FlatY());
                path.lineTo(br[1].FlatX(),br[1].FlatY());
                path.lineTo(br[2].FlatX(),br[2].FlatY());
                canvas.fillStyle = leafColor;
                canvas.fill(path);
                var tx, ty;
                tx = br[0].FlatX() + br[1].FlatX();
                ty = br[0].FlatY() + br[1].FlatY();
                canvas.beginPath();
                rad = ballSize3 * magScale;
                canvas.arc(tx/2, ty/2, rad, 0, 2 * Math.PI, true);
                canvas.fillStyle = ornColor3;
                canvas.fill();
            }
            else if(treePoints[i].type==6 && br[0].Z>=0)
            {
                var onoff = getRandom(0,100);
                if(onoff%2==0)
                {
                    canvas.beginPath();
                    rad = 1.5 * magScale;
                    if(rad<1)
                        rad = 1;
                    canvas.arc(br[0].FlatX(), br[0].FlatY(), rad, 0, 2 * Math.PI, true);
                    canvas.fillStyle = ornColor4;
                    canvas.fill();
                }
                path = new Path2D();
                path.moveTo(br[0].FlatX(),br[0].FlatY());
                path.lineTo(br[1].FlatX(),br[1].FlatY());
                path.lineTo(br[2].FlatX(),br[2].FlatY());
                canvas.fillStyle = leafColor;
                canvas.fill(path);
            }
        }
        for(i=0 ; i<treePoints.length ; i++)
        {
            br = treePoints[i].branchPoints;
            if(treePoints[i].type==0 && br[0].Z>=0)
            {
                path = new Path2D();
                path.moveTo(br[0].FlatX(),br[0].FlatY());
                path.lineTo(br[1].FlatX(),br[1].FlatY());
                path.lineTo(br[2].FlatX(),br[2].FlatY());
                canvas.fillStyle = branchColor;
                canvas.fill(path);
            }
        }
        //drawpole
        br = treePoints[treePoints.length-1].branchPoints;
        path = new Path2D();
        path.moveTo(br[0].FlatX(),br[0].FlatY());
        path.lineTo(br[1].FlatX(),br[1].FlatY());
        path.lineTo(br[2].FlatX(),br[2].FlatY());
        canvas.fillStyle = branchColor;
        canvas.fill(path);
        for(i=0 ; i<treePoints.length ; i++)
        {
            br = treePoints[i].branchPoints;
            if(treePoints[i].type==0 && br[0].Z<0)
            {
                path = new Path2D();
                path.moveTo(br[0].FlatX(),br[0].FlatY());
                path.lineTo(br[1].FlatX(),br[1].FlatY());
                path.lineTo(br[2].FlatX(),br[2].FlatY());
                canvas.fillStyle = branchColor;
                canvas.fill(path);
            }
        }
        for(i=0 ; i<treePoints.length ; i++)
        {
            br = treePoints[i].branchPoints;
            if(treePoints[i].type==1 && br[0].Z<0)
            {
                path = new Path2D();
                path.moveTo(br[0].FlatX(),br[0].FlatY());
                path.lineTo(br[1].FlatX(),br[1].FlatY());
                path.lineTo(br[2].FlatX(),br[2].FlatY());
                canvas.fillStyle = leafColor;
                canvas.fill(path);
            }
            else if(treePoints[i].type==2 && br[0].Z<0)
            {
                canvas.beginPath();
                rad = ballSize1 * magScale;
                canvas.arc(br[1].FlatX(), br[1].FlatY(), rad, 0, 2 * Math.PI, true);
                canvas.fillStyle = ornColor;
                canvas.fill();
            }
            else if(treePoints[i].type==3 && br[0].Z<0)
            {
                canvas.beginPath();
                rad = ballSize2 * magScale;
                canvas.arc(br[2].FlatX(), br[2].FlatY(), rad, 0, 2 * Math.PI, true);
                canvas.fillStyle = ornColor2;
                canvas.fill();
            }
            else if(treePoints[i].type==5 && br[0].Z<0)
            {
                path = new Path2D();
                path.moveTo(br[0].FlatX(),br[0].FlatY());
                path.lineTo(br[1].FlatX(),br[1].FlatY());
                path.lineTo(br[2].FlatX(),br[2].FlatY());
                canvas.fillStyle = leafColor2;
                canvas.fill(path);
            }
            else if(treePoints[i].type==4 && br[0].Z<0)
            {
                path = new Path2D();
                path.moveTo(br[0].FlatX(),br[0].FlatY());
                path.lineTo(br[1].FlatX(),br[1].FlatY());
                path.lineTo(br[2].FlatX(),br[2].FlatY());
                canvas.fillStyle = leafColor;
                canvas.fill(path);
                canvas.beginPath();
                var tx, ty;
                tx = br[0].FlatX() + br[1].FlatX();
                ty = br[0].FlatY() + br[1].FlatY();
                rad = ballSize3 * magScale;
                canvas.arc(tx/2, ty/2, rad, 0, 2 * Math.PI, true);
                canvas.fillStyle = ornColor3;
                canvas.fill();
            }
            else if(treePoints[i].type==6 && br[0].Z<0)
            {
                var onoff = getRandom(0,100);
                if(onoff%2==0)
                {
                    canvas.beginPath();
                    rad = 1.5 * magScale;
                    if(rad<1)
                        rad= 1;
                    canvas.arc(br[0].FlatX(), br[0].FlatY(), rad, 0, 2 * Math.PI, true);
                    canvas.fillStyle = ornColor4;
                    canvas.fill();
                }
                path = new Path2D();
                path.moveTo(br[0].FlatX(),br[0].FlatY());
                path.lineTo(br[1].FlatX(),br[1].FlatY());
                path.lineTo(br[2].FlatX(),br[2].FlatY());
                canvas.fillStyle = leafColor;
                canvas.fill(path);

            }
        }
    }
    function drawStar(name, starPoint)
    {
        var i;
        var s, f;

        var canvas = document.getElementById(name).getContext('2d');
        if(starPoint[15].z<0)
        {
            s = starPoint[15];
            f = starPoint[16];
        }
        else
        {
            s = starPoint[16];
            f = starPoint[15];
        }
        for(i=0 ; i<5 ; i++)
        {
            path = new Path2D();
            path.moveTo(starPoint[i*3].FlatX(), starPoint[i*3].FlatY());
            path.lineTo(starPoint[i*3+1].FlatX(), starPoint[i*3+1].FlatY());
            path.lineTo(s.FlatX(), s.FlatY());
            canvas.fillStyle = starColor;
            canvas.fill(path);

            path = new Path2D();
            path.moveTo(starPoint[i*3].FlatX(), starPoint[i*3].FlatY());
            path.lineTo(starPoint[i*3+2].FlatX(), starPoint[i*3+2].FlatY());
            path.lineTo(s.FlatX(), s.FlatY());
            canvas.fillStyle = starColor;
            canvas.fill(path);
        }
        for(i=0 ; i<5 ; i++)
        {
            path = new Path2D();
            path.moveTo(starPoint[i*3].FlatX(), starPoint[i*3].FlatY());
            path.lineTo(starPoint[i*3+1].FlatX(), starPoint[i*3+1].FlatY());
            path.lineTo(f.FlatX(), f.FlatY());
            canvas.fillStyle = starColor;
            canvas.fill(path);

            path = new Path2D();
            path.moveTo(starPoint[i*3].FlatX(), starPoint[i*3].FlatY());
            path.lineTo(starPoint[i*3+2].FlatX(), starPoint[i*3+2].FlatY());
            path.lineTo(f.FlatX(), f.FlatY());
            canvas.fillStyle = starColor;
            canvas.fill(path);
        }
    }
    function dropSnow(snowPoint)
    {
        for(i=0 ; i<snowPoint.length ; i++)
        {
            if(snowPoint[i].point.Y <= 0)
            {
                snowPoint[i].point.Y += (0.4444 * cof);
            }
            else if(snowPoint[i].point.Y > 0)
            {
                snowPoint[i].point.Y = 1;
                snowPoint[i].melt--;
                if(snowPoint[i].melt<0)
                    snowPoint[i] = new SnowBall();
            }
        }
    }
    function drawSnow(name, snowPoint, fob)
    {
        var i;
        var snowSize = 2*magScale;
        if(snowSize<1)
            snowSize = 1;
        var canvas = document.getElementById(name).getContext('2d');
        canvas.fillStyle = snowColor;
        for(i=0 ; i<snowPoint.length ; i++)
        {
            if(fob==true && snowPoint[i].point.Z>=0)
                canvas.fillRect(snowPoint[i].point.FlatX(),snowPoint[i].point.FlatY(),snowSize,snowSize);
            else if(fob==false && snowPoint[i].point.Z<0)
                canvas.fillRect(snowPoint[i].point.FlatX(),snowPoint[i].point.FlatY(),snowSize,snowSize);
        }
    }
    function rotateSnow(snowPoint)
    {
        var i;
        var a = angleSpeed * Math.PI/180;
        for(i=0 ; i<snowPoint.length ; i++)
        {
            tx = Math.cos(a)*snowPoint[i].point.X + Math.sin(a)*snowPoint[i].point.Z;
            tz = -Math.sin(a) * snowPoint[i].point.X + Math.cos(a)*snowPoint[i].point.Z;
            snowPoint[i].point = new Point3D(tx, snowPoint[i].point.Y, tz);
        }
    }
    function rotateStar(starPoint)
    {
        var i;
        var tx, tz;
        var a = angleSpeed * Math.PI/180;
        for(i=0 ; i<17 ; i++)
        {
            tx = Math.cos(a)*starPoint[i].X + Math.sin(a)*starPoint[i].Z;
            tz = -Math.sin(a) * starPoint[i].X + Math.cos(a)*starPoint[i].Z;
            starPoint[i] = new Point3D(tx, starPoint[i].Y, tz);
        }
    }
    function rotateTree(treePoints)
    {
        var i;
        for(i=0 ; i<treePoints.length - 1; i++)
        {
            treePoints[i].rotateBranch(new Point3D(0,0,0), 0, angleSpeed);
        }
    }
    function initCanvas(name)
    {
        var canvas = document.getElementById(name).getContext('2d');
        canvas.clearRect(0,0,trees.width, trees.height);
    }
    function drawTreeToScreen()
    {
        var delta;
        now = Date.now(); 
        delta = now - than;
        than = now;
        cof = delta / interval;
        angleSpeed = 0.07 * cof;

        initCanvas(trees.name);
        drawSnow(trees.name, trees.snowPoint, true);
        drawBranch(trees.name, trees.treePoints);
        drawStar(trees.name, trees.starPoint);
        drawSnow(trees.name, trees.snowPoint, false);

        dropSnow(trees.snowPoint);
        rotateTree(trees.treePoints);
        rotateStar(trees.starPoint);
        rotateSnow(trees.snowPoint);
        window.requestAnimationFrame(drawTreeToScreen);
    }
    function createBranch(level, parentTree)
    {
        if(level>depth || parentTree.height<45)
        {
            var tmp = getRandom(0,10000);
            if(tmp%200<5)
            {
                parentTree.body.type = 2;
            }
            else if(tmp%200<10)
            {
                parentTree.body.type = 3;
            }
            else if(tmp%200<16)
            {
                parentTree.body.type = 4;
            }
            else if(tmp%200<30)
            {
                parentTree.body.type = 5;
            }
            else if(tmp%200 < 130)
            {
                parentTree.body.type = 6;
            }
            else
                parentTree.body.type = 1;

            parentTree.childNum = 0;
            return 1;
        }
        else
        {
            var i;
            var sum = 0;
            var loc;
            var h;
            if(level>0)
            {
                for(i=0 ; i<parentTree.childNum ; i++)
                {
                    loc = i*70 / (parentTree.childNum + 1) + 10;
                    h = parentTree.height * (loc+level*20 ) / 210 ;
                    parentTree.childs[i] = new Tree(h, loc, getRandom(30,40) + loc / 3, 90 * (level %2) + (i%2) * 180 +
                    (0.5+(-1)*(i%2))*40, getRandom(8,10));
                    parentTree.childs[i].body = new Branch(new Point3D(0,(-1.7 * h + level*5),0), new Point3D(-(15*(2*h + level * 10)/treeheight),0,0), new Point3D((15*(2*h + level * 10)/treeheight),0,0));
                    sum += createBranch(level+1, parentTree.childs[i]);
                }
                parentTree.wholeChildNum = sum;
                return sum+1;
            }
            else
            {
                for(i =0; i<parentTree.childNum ; i++)
                {
                    loc = (i/3)*250 / (parentTree.childNum+1) + 15;
                    h = parentTree.height * loc / 240;
                    parentTree.childs[i] = new Tree(h, loc, getRandom(30,40) + loc / 3, i*100, getRandom(20,25));
                    parentTree.childs[i].body = new Branch(new Point3D(0, (-1.2 * h),0),new Point3D(-(20*(2*h + level * 30)/treeheight),0,0),new Point3D((20*(2*h + level * 30)/treeheight),0,0));
                    sum+= createBranch(level+1, parentTree.childs[i]);
                }
                parentTree.wholeChildNum = sum;
                return sum+1;
            }
        }
    }
    function locateBranch(level, parentTree)
    {
        if(level > depth)
        {
            return [parentTree.body];
        }
        else
        {
            var i, j;
            var v;
            var st, fi;
            var origin;
            var len = parentTree.wholeChildNum + 1;
            var tempBranch;
            var allBranch = [];
            st = parentTree.body.branchPoints[0];
            fi = new Point3D((parentTree.body.branchPoints[1].X + parentTree.body.branchPoints[2].X) / 2, (parentTree.body.branchPoints[1].Y + parentTree.body.branchPoints[2].Y) / 2, 0);
            for(i=0 ; i<parentTree.childNum ; i++)
            {
                tempBranch = locateBranch(level+1, parentTree.childs[i]);
                origin = new Point3D(st.X + (fi.X-st.X)*parentTree.childs[i].z / 100, st.Y + (fi.Y-st.Y) * parentTree.childs[i].z / 100, 0);
                for(j=0; j<(parentTree.childs[i].wholeChildNum+1) ; j++)
                {
                    tempBranch[j].rotateBranch(origin, parentTree.childs[i].theta, parentTree.childs[i].psi);
                }
                allBranch = allBranch.concat(tempBranch);
            }
            allBranch = allBranch.concat(parentTree.body);
            return allBranch;
        }
    }
    function initTree(w, h, n)
    {
        this.depth = 4;
        this.height=h;
        this.width=w;
        this.name=n;
        if(h<500)
            this.treeHeight = 500;
        else
            this.treeHeight = 650;
        treeheight = this.treeHeight;
        width = w;
        height = h;
        magScale = this.height*0.8/this.treeHeight;
        this.mainpole = new Tree(this.treeHeight, 50, 90, 0, 25);
        this.mainpole.body = new Branch(new Point3D(0, -this.treeHeight, 0),
                new Point3D(-20, 0, 0),
                new Point3D(20, 0, 0));
        createBranch(0, this.mainpole);
        this.treePoints = locateBranch(0, this.mainpole);
        this.starPoint = new Star();
        this.snowPoint = new Snow();
    }
    ns.startTree = function(w, h, n)
    {
        trees = new initTree(w, h, n);
        window.requestAnimationFrame(drawTreeToScreen);
    }
    return ns;
})(XTREE || {});
