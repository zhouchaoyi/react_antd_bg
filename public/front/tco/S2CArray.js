/*
 
	S2CArray.js

	Created by Advanced Computer Graphics on 2/6/2014
	Copyright  2014 Advanced Computer Grahpics, INC.  All rights reserved.

*/
function S2CArray()
{
    this.rows = 0;
	this.columns = 0;
	this.data = [];
}
S2CArray.create = function( rowCount, columnCount )
{
	var a = new S2CArray();
	a.data = new Array();
	a.rows = rowCount;
	a.columns = columnCount;
	
	var cnt = arguments.length - 1;
	var revArr = new Array();
	while( cnt > 1 ) revArr.push( arguments[ cnt-- ] );
			
	for ( var r = 0; r < rowCount; r++ )
	{
		var rowArr = new Array();
		for ( var c = 0; c < columnCount; c++ )
		{
			rowArr.push( revArr.pop() );
		}
			
		a.data.push( rowArr );
	}
		
	return a;
}

S2CArray.prototype.clean = function (s) {
    var rarr = [];
    for (var r = 0; r < this.data.length; r++) {
        rarr.push([]);
        for (var c = 0; c < this.data[r].length; c++) {
            var o = this.data[r][c];
            while (typeof (o) == 'function')
                o = o.call(s);
            rarr[r].push(o);
        }
    }
    var result = new S2CArray();
    result.rows = this.rows;
    result.columns = this.columns;
    result.data = rarr;
    return result;
}

S2CArray.prototype.getObject = function( row, col )
{
	return this.data[ row ][ col ];
}

S2CArray.prototype.toArray = function ()
{
	var result = new Array();
	for( var r = 0; r < this.rows; r++ )
	{
		for( var c = 0; c < this.columns; c++ )
		{
			result.push( this.getObject( r, c ) );
		}
	}
	return result;
}
	
S2CArray.prototype.toString = function()
{
	var result = "[";
	for ( var r = 0; r < this.data.length; r++ )
	{
		result += "[";
			
		var rowArr = this.data[ r ];
		for ( var c = 0; c < rowArr.length; c++ )
		{
			var obj = rowArr[ c ];
			result += ( c == 0 ) ? obj.toString() : "," + obj.toString();
		}
			
		result += "]";
	}
	result += "]";
	return result;
}