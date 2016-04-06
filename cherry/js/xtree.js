var XTREE = (function(ns){
    var trees;
    var magScale = 1;
    var depth = 5;
    var width;
    var height;
    var treeheight;
    var branchColor = "#19050A";
    var leafColor = "#bc8f8f";
    var leafColor2 = "#ffb6c1";
    var snowColor = "#ffb6c1";
    var snowNum = 300;
   var rotateOrigin = new Point3D(0,0,0);
    var snowIndex = 0;
    var angleSpeed = 0.1;
    var cof = 1.0;
    var now;
    var than = Date.now();
    var fps = 60;
    var interval = 1000/fps;
    var ballSize1 = 1.7;
    var ballSize2 = 5;
    var ballSize3 = 2;
    var drawFunctions = {};
    var drawLeaves = [];
    var colors = [ branchColor, leafColor, leafColor2];
   drawLeaves[1] = drawLeaves[2] = function(br, canvas){
        canvas.beginPath();
        rad = ballSize1 * magScale;
                
        canvas.fillRect(br[1].FlatX(), br[1].FlatY(),rad,rad);
    //    canvas.arc(br[1].FlatX(), br[1].FlatY(), rad, 0, 2 * Math.PI, true);
        canvas.fill();
    };
   drawFunctions.Branch = function(treePoints, canvas, fob){
        var i;
        var c = fob==true?1:-1;
        canvas.fillStyle = branchColor;
        for(i=0 ; i<treePoints.length ; i++)
        {
            br = treePoints[i].branchPoints;
            if(treePoints[i].type==0 && c*br[0].Z>=0)
            {
                path = new Path2D();
                path.moveTo(br[0].FlatX(),br[0].FlatY());
                path.lineTo(br[1].FlatX(),br[1].FlatY());
                path.lineTo(br[2].FlatX(),br[2].FlatY());
                canvas.fill(path);
                path = null;
            }
        }
    };
    drawFunctions.Leaf = function(treePoints, canvas, fob){
        var i;
        var c = fob==true?1:-1;
        var past = 0;
        var ttyp;
        for(i=0 ; i<treePoints.length ; i++)
        {
            br = treePoints[i].branchPoints;
            if(treePoints[i].type > 0 && c*br[0].Z>=0)
            {
                ttyp = treePoints[i].type;
                if(past!=ttyp)
                    canvas.fillStyle = colors[ttyp];
                past = ttyp;
                drawLeaves[ttyp](br, canvas);
            }
        }
    }
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
    
    function SnowBall()
    {
        var rad = getRandom(width*0.05, height*0.55555 )/magScale;
        var t= getRandom(0,360);
        this.melt = getRandom(100,150);
        this.point = null;
        this.point = new Point3D(rad * Math.cos(t*Math.PI/180), getRandom(-treeheight,0), rad* Math.sin(t*Math.PI/180));
    }   
    function Snow()
    {
        var s = [];
        var i;
        for(i=0 ; i<snowNum ; i++)
        {
            s[i] = null;
            s[i] = new SnowBall();
        }
        return s;
    }   
    function Branch(head, tail, tail2)
    {
        this.branchPoints = [head, tail, tail2];
        this.branchPoints.lightOn = true;
        this.branchPoints.lightOpacity = getRandom(0,100)/100;
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
            branchOrigin = null;
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

    function drawBranch(name, treePoints, canvas){
        var i;
        var br;
        var path;
        drawFunctions.Leaf(treePoints, canvas, true);
        drawFunctions.Branch(treePoints, canvas, true);
        //drawpole
        br = treePoints[treePoints.length-1].branchPoints;
        path = new Path2D();
        path.moveTo(br[0].FlatX(),br[0].FlatY());
        path.lineTo(br[1].FlatX(),br[1].FlatY());
        path.lineTo(br[2].FlatX(),br[2].FlatY());
        canvas.fillStyle = branchColor;
        canvas.fill(path);
        drawFunctions.Branch(treePoints, canvas, false);
        drawFunctions.Leaf(treePoints, canvas, false);
        path = null;  
    }   
    function dropSnow(snowPoint)
    {
        for(i=0 ; i<snowPoint.length ; i++)
        {
            if(snowPoint[i].point.Y <= 0)
            {
                snowPoint[i].point.X += 0.3 * cof;
                snowPoint[i].point.Y += (0.444 * cof);
            }
            else if(snowPoint[i].point.Y > 0)
            {
                snowPoint[i].point.Y = 1;
                snowPoint[i].melt--;
                if(snowPoint[i].melt<0)
                {
                    snowPoint[i] = null;
                    snowPoint[i] = new SnowBall();

                }
            }
        }
    }
    function drawSnow(name, snowPoint, fob, canvas)
    {
        var i;
        var snowSize = 2*magScale;
        if(snowSize<1)
            snowSize = 1;
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
            snowPoint[i].point.X = tx;
            snowPoint[i].point.Z = tz;
        }
    }
    function rotateTree(treePoints)
    {
        var i;
        for(i=0 ; i<treePoints.length - 1; i++)
        {
            treePoints[i].rotateBranch(rotateOrigin, 0, angleSpeed);
        }
    }
    function initCanvas(name)
    {
        var canvas = document.getElementById(name).getContext('2d');
        var m_canvas = document.createElement('canvas');
        canvas.clearRect(0,0,trees.width,trees.height);
        m_canvas.width = trees.width;
        m_canvas.height = trees.height;
        return m_canvas;
    }
    function drawTreeToScreen()
    {
        var delta;
        now = Date.now(); 
        delta = now - than;
        than = now;
        cof = delta/interval;
        angleSpeed = 0.05 * cof;
      
        var canvas = initCanvas(trees.name);
        var m_context = canvas.getContext('2d');
        var context = document.getElementById(trees.name).getContext('2d');
        drawSnow(trees.name, trees.snowPoint, true, m_context);
        drawBranch(trees.name, trees.treePoints, m_context);
        drawSnow(trees.name, trees.snowPoint, false, m_context);
        dropSnow(trees.snowPoint);
        rotateTree(trees.treePoints);
        rotateSnow(trees.snowPoint);
        context.clearRect(0,0,trees.width,trees.height);
        context.drawImage(canvas,0,0);
        canvas = null;
        context = null;
        m_context = null;
        window.requestAnimationFrame(drawTreeToScreen);
    }
    function createBranch(level, parentTree)
    {
        if(level>depth || parentTree.height<50)
        {
            parentTree.body.type =getRandom(0,1000)%9<3?1:2;
            parentTree.childNum = 0;
            return 1;
        }
        else
        {
            var i;
            var sum = 0;
            var loc;
            var h;
            if(level == depth-1)
            {
                for(i=0 ; i< parentTree.childNum ; i++)
                {
                    loc = i*75 / (parentTree.childNum + 1) + 10;
                    h = 6;
                    parentTree.childs[i] = new Tree(h, loc, getRandom(30,40) + loc / 3, getRandom(0,360), 1);
                    parentTree.childs[i].body = new Branch(new Point3D(0,h,0), new Point3D(-2,0,0), new Point3D(2,0,0));
                    sum += createBranch(level+1, parentTree.childs[i]);
                }
                parentTree.wholeChildNum = sum;
                return sum+1;
            }
            else if(level == depth - 2)
            {
                for(i=0 ; i< parentTree.childNum ; i++)
                {
                    loc = i*75 / (parentTree.childNum + 1) + 10 ;
                    h = parentTree.height * (loc + 30) / 150 + 20;
                    parentTree.childs[i] = new Tree(h, loc, getRandom(30,40) + loc / 3, getRandom(0,360),
                    getRandom(10,13));
                    parentTree.childs[i].body = new Branch(new Point3D(0, (-1.7*h + level*5), 0), new
                    Point3D(-2*(h+level*10)/treeheight,0,0), new Point3D(3*(h+level*10)/treeheight,0,0));
                    sum += createBranch(level+1, parentTree.childs[i]);
                }
                parentTree.wholeChildNum = sum;
                return sum+1;
            }
            else if(level>0)
            {
                for(i=0 ; i<parentTree.childNum ; i++)
                {
                    loc = i*85 / (parentTree.childNum + 1)+ 10;
                    h = parentTree.height * (loc+30 ) / 180 + getRandom(30,40);
                    parentTree.childs[i] = new Tree(h, loc, getRandom(30,40) + loc / 3, getRandom(90,270),
                    getRandom(5,7));
                    parentTree.childs[i].body = new Branch(new Point3D(0,(-1.7 * h + level*5),0), new Point3D(-(5*(h + level * 10)/treeheight),0,0), new Point3D(((2*h + level * 10)/treeheight),0,0));
                    sum += createBranch(level+1, parentTree.childs[i]);
                }
                parentTree.wholeChildNum = sum;
                return sum+1;
            }

            else
            {
                for(i =0; i<parentTree.childNum ; i++)
                {
                    loc = i * 40 / (parentTree.childNum) +30;
                    h = getRandom(250,275);
                    parentTree.childs[i] = new Tree(h, loc, loc+10, i*60, getRandom(5,7));
                    parentTree.childs[i].body = new Branch(new Point3D(0, (-1.2 * h),0),new Point3D(-(8*(h + level * 10)/treeheight),0,0),new Point3D((8*(h + level * 10)/treeheight),0,0));
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
            this.treeHeight = 300;
        else
            this.treeHeight = 300;
        treeheight = this.treeHeight;
        width = w;
        height = h;
        magScale = this.height*0.3/this.treeHeight;
        this.mainpole = new Tree(this.treeHeight, 50, 90, 0, 9);
        this.mainpole.body = new Branch(new Point3D(0, -this.treeHeight, 0),
                new Point3D(-20, 0, 0),
                new Point3D(20, 0, 0));
        createBranch(0, this.mainpole);
        this.treePoints = locateBranch(0, this.mainpole);
        this.snowPoint = new Snow();
    }
    ns.startTree = function(w, h, n)
    {
        trees = new initTree(w, h, n);
        window.requestAnimationFrame(drawTreeToScreen);
    }
    return ns;
})(XTREE || {});
