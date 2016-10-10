/*
 
	S2CObject.js

	Created by Advanced Computer Graphics on 2/6/2014
	Copyright  2014 Advanced Computer Grahpics, INC.  All rights reserved.

*/
function S2CObject()
{
    this.type = null;
	this.value = {};
    this.fixed = false;
    this.id = '';
}
S2CObject.INTEGER = 0;
S2CObject.DOUBLE = 1;
S2CObject.STRING = 2;
S2CObject.RANGE = 3;
S2CObject.DATE = 4;
S2CObject.ARRAY = 5;
S2CObject.ERROR = 99;

S2CObject.NA_ERR = -2146826246;
S2CObject.REF_ERR = -2146826265;
S2CObject.DIV0_ERR = -2146826281;
S2CObject.VALUE_ERR = -2146826273;
S2CObject.NUM_ERR = -2146826252;
S2CObject.NAME_ERR = -2146826259;
S2CObject.NULL_ERR = -2146826288;

S2CObject.createWithInt = function( val )
{
	var o = new S2CObject();
	o.type = S2CObject.INTEGER;
	o.value = val;
	return o;
}

S2CObject.createWithDouble = function( val )
{
	var o = new S2CObject();
	o.type = S2CObject.DOUBLE;
	o.value = val;
	return o;
}

S2CObject.createWithString = function( val )
{
	var o = new S2CObject();
	o.type = S2CObject.STRING;
	o.value = val;
	return o;
}

S2CObject.createWithRange = function( val, oid, fix )
{
	var o = new S2CObject();
	o.type = S2CObject.RANGE;
	o.value = val;
    o.id = oid;
    o.fixed = fix;
	return o;
}

S2CObject.createWithDate = function( val )
{
	var o = new S2CObject();
	o.type = S2CObject.DATE;
	o.value = val;
	return o;
}

S2CObject.createWithArray = function( val )
{
	var o = new S2CObject();
	o.type = S2CObject.ARRAY;
	o.value = val;
	return o;
}

S2CObject.createWithError = function( val )
{
	var o = new S2CObject();
	o.type = S2CObject.ERROR;
	o.value = val;
	return o;
}

S2CObject.prototype.isInt = function()
{
	return this.type == S2CObject.INTEGER;
}

S2CObject.prototype.isDouble = function()
{
	return this.type == S2CObject.DOUBLE;
}

S2CObject.prototype.isNumeric = function()
{
	return this.isInt() || this.isDouble();
}

S2CObject.prototype.isString = function()
{
	return this.type == S2CObject.STRING;
}

S2CObject.prototype.isRange = function()
{
	return this.type == S2CObject.RANGE;
}

S2CObject.prototype.isDate = function()
{
	return this.type == S2CObject.DATE;
}

S2CObject.prototype.isArray = function()
{
	return this.type == S2CObject.ARRAY;
}

S2CObject.prototype.isError = function()
{
	return this.type == S2CObject.ERROR;
}

S2CObject.prototype.numDays = function()
{
	if ( this.isDate() )
	{
		var dte = this.value;
		var refDte = new Date( 1900, 3, 1 );
		return ( ( dte.valueOf() - refDte.valueOf() ) / (1000 * 60 * 60 * 24 ) ) + 61;
	}
	else
	{
		return 0;
	}
}

S2CObject.prototype.toInt = function()
{
	if ( this.isNumeric() )
	{
		return parseInt( this.value, 10 );
	}
	else
	{
		return 0;
	}
}

S2CObject.prototype.toDouble = function()
{
	if ( this.isNumeric() )
	{
		return this.value;
	}
	else
	{
		return 0;
	}
}

S2CObject.prototype.toString = function()
{
	if ( this.isError() )
	{
		return this.toError();
	}
	else
	{
		return this.value.toString();
	}
}

S2CObject.prototype.toRange = function(s)
{
	if ( this.isRange() )
	{
	    if (s) return this.value.clean(s);
		return this.value;
	}
	else
	{
		return S2CArray.create( 1, 1, this );
	}
}

S2CObject.prototype.toDate = function()
{
	if ( this.isDate() )
	{
		return this.value;
	}
	else
	{
		return new Date();
	}
}

S2CObject.prototype.toArray = function()
{
	if ( this.isArray() )
	{
		return this.value;
	}
	else
	{
		return null;
	}
}

S2CObject.prototype.toError = function()
{
	if ( this.isError() )
	{
		switch( this.value )
		{
			case S2CObject.NA_ERR:
				return "#N/A";
			case S2CObject.REF_ERR:
				return "#REF!";
			case S2CObject.DIV0_ERR:
				return "#DIV/0!";
			case S2CObject.VALUE_ERR:
				return "#VALUE!";
			case S2CObject.NUM_ERR:
				return "#NUM!";
			case S2CObject.NAME_ERR:
				return "#NAME?";
			case S2CObject.NULL_ERR:
				return "#NULL!";
			default:
				return "Unknown error type: " + value.toString();
		}
	}
	else
	{
		return "";
	}
}