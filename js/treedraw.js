var angleSpeed = 0.3;
function drawTree(){
	var i;
	var br;
	var canvas = document.getElementById('xtree').getContext('2d');
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
	}
}
function drawStar()
{
	var i;
	var s, f;

	var canvas = document.getElementById('xtree').getContext('2d');
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
function dropSnow(fob)
{
	for(i=0 ; i<snowNum ; i++)
	{
		if(snowPoint[i].point.Y < 0)
		{
			snowPoint[i].point.Y += 2;
		}
		else if(snowPoint[i].point.Y == 0)
		{
			snowPoint[i].point.Y = 0;
			snowPoint[i].melt--;
			if(snowPoint[i].melt<0)
				snowPoint[i] = new SnowBall();
		}
	}
}
function drawSnow(fob)
{
	var i;
	var snowSize = 2*magScale;
	var canvas = document.getElementById('xtree').getContext('2d');
	canvas.fillStyle = snowColor;
	for(i=0 ; i<snowNum ; i++)
	{
		if(fob==true && snowPoint[i].point.Z>=0)
			canvas.fillRect(snowPoint[i].point.FlatX(),snowPoint[i].point.FlatY(),snowSize,snowSize);
		else if(fob==false && snowPoint[i].point.Z<0)
			canvas.fillRect(snowPoint[i].point.FlatX(),snowPoint[i].point.FlatY(),snowSize,snowSize);

	}
}
function rotateSnow()
{
	var i;
	var a = angleSpeed * Math.PI/180;
	for(i=0 ; i<snowNum ; i++)
	{
		tx = Math.cos(a)*snowPoint[i].point.X + Math.sin(a)*snowPoint[i].point.Z;
		tz = -Math.sin(a) * snowPoint[i].point.X + Math.cos(a)*snowPoint[i].point.Z;
		snowPoint[i].point = new Point3D(tx, snowPoint[i].point.Y, tz);
	}
}
function rotateStar()
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
function rotateTree()
{
	var i;
	for(i=0 ; i<treePoints.length - 1; i++)
	{
		treePoints[i].rotateBranch(new Point3D(0,0,0), 0, angleSpeed);
	}
}
function initCanvas()
{
	var canvas = document.getElementById('xtree').getContext('2d');
	canvas.clearRect(0,0,width,height);
}
function draw()
{
	initCanvas();
	drawSnow(true);
	drawTree();
	drawStar();
	drawSnow(false);
	dropSnow();
	rotateTree();
	rotateStar();
	rotateSnow();
	window.requestAnimationFrame(draw);
}	
