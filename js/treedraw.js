var angleSpeed = 0.3;
var cof = 1.0;
var now;
var than = Date.now();
var fps = 60;
var interval = 1000/fps;
var ballSize1 = 6;
var ballSize2 = 8;
var ballSize3 = 2;
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
    angleSpeed = 0.03 * cof;

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
