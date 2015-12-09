var trees;
var magScale = 1;
var depth = 333;
var width;
var height;
var treeheight;
function createBranch(level, parentTree)
{
	if(level>depth || parentTree.height<50)
	{
		var tmp = getRandom(0,10000);
        if(tmp%200<10)
        {
            parentTree.body.type = 2;
        }
        else if(tmp%200<17)
        {
            parentTree.body.type = 3;
        }
        else if(tmp%200<50)
        {
            parentTree.body.type = 4;
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
				parentTree.childs[i] = new Tree(h, loc, getRandom(30,40) + loc / 3, 90 * (level %2) + (i%2) * 180 + (0.5+(-1)*(i%2))*40, getRandom(10,15));
				parentTree.childs[i].body = new Branch(new Point3D(0,(-1.7 * h + level*5),0),new Point3D(-(15*(2*h + level * 10)/treeheight),0,0), new Point3D((15*(2*h + level * 10)/treeheight),0,0));
				sum+=createBranch(level+1, parentTree.childs[i]);
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
function initTree(w, h, n)
{
	this.depth = 4;
	this.height=h;
	this.width=w;
	this.name=n;
	if(this.height<600)
		this.treeHeight = 850;
	else if(this.height<1200)
		this.treeHeight = 800;
	else
		this.treeHeight = 750;
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
function startTree(w, h, n)
{
    trees = new initTree(w, h, n);
    window.requestAnimationFrame(draw);
}
