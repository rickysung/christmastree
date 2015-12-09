var branchColor="#117733";
var leafColor="#117733";
var snowColor ="#FFFFFF";
var starColor = "#FFFF33";
var ornColor = "#113311";
var ornColor2 = "#AA1111";
var ornColor3 = "#FFAA00";
var snowNum = 1500;
var snowIndex = 0;
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
