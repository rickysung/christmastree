var depth = 4;
var mainpole;
var treePoints;
var snowPoint;
var starPoint;
var height;
var width;
var magScale = 1;
function createBranch(level, parentTree)
{
	if(level>depth || parentTree.height<50)
	{
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
				loc = i*70 / (parentTree.childNum + 1) + 15;
				h = parentTree.height * (loc+level*20 ) /210 ;
				parentTree.childs[i] = new Tree(h, loc, getRandom(30,40) + loc / 3, 90 * (level %2) + (i%2) * 180 + (0.5+(-1)*(i%2))*40,getRandom(10,15));
				parentTree.childs[i].body = new Branch(new Point3D(0,(-1.7 * h + level*5),0),new Point3D(-(20*(2*h + level * 10)/mainpole.height),0,0), new Point3D((20*(2*h + level * 10)/mainpole.height),0,0));
				sum+=createBranch(level+1, parentTree.childs[i]);
			}
			parentTree.wholeChildNum = sum;
			return sum+1;
		}
		else
		{
			for(i =0; i<parentTree.childNum ; i++)
			{
				loc = (i/3)*250 / (parentTree.childNum+1) + 10;
				h = parentTree.height * loc / 240;
				parentTree.childs[i] = new Tree(h, loc, getRandom(30,40) + loc / 3, i*100, getRandom(10,14));
				parentTree.childs[i].body = new Branch(new Point3D(0, (-1.2 * h),0),new Point3D(-(20*(2*h + level * 30)/mainpole.height),0,0),new Point3D((20*(2*h + level * 30)/mainpole.height),0,0));
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
		return [parentTree.Body];
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
function initTree(w, h)
{
	width = w;
	height = h;
	if(height<600)
		treeHeight = 850;
	else if(height<1200)
		treeHeight = 800;
	else
		treeHeight = 750;
//	treeHeight = getRandom(600,800); 
	magScale = height*0.8/treeHeight;
	mainpole = new Tree(treeHeight, 50, 90, 0, 30);
	mainpole.body = new Branch(new Point3D(0, -treeHeight, 0),
					 				new Point3D(-20, 0, 0),
									new Point3D(20, 0, 0));
	createBranch(0,mainpole);
	treePoints = locateBranch(0,mainpole);
	starPoint = new Star();
	snowPoint = new Snow();
	window.requestAnimationFrame(draw);
}
