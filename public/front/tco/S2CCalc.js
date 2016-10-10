/*
 
	S2CCalc.js

	Created by Advanced Computer Graphics on 2/6/2014
	Copyright  2014 Advanced Computer Grahpics, INC.  All rights reserved.

*/
var $2 = S2CObject.createWithInt;
var $3 = S2CObject.createWithDouble;
var $4 = S2CObject.createWithString;
var $5 = S2CObject.createWithRange;
var $6 = S2CObject.createWithDate;
var $7 = S2CObject.createWithArray;
var $8 = S2CObject.createWithError;
var $9 = S2CArray.create;
var $0 = $3(0);
var $1 = $3(1);
function S2CCalc()
{
var _me=this;
this.ACG_B20=$3(0);
this.ACG_B5=$3(0.1);
this.ACG_C20=$3(0);
this.Revised_Inputs_C10=$3(0);
this.Revised_Inputs_C12=$3(0.8);
this.Revised_Inputs_C14=$3(0.2);
this.Revised_Inputs_C16=$3(0);
this.Revised_Inputs_C18=$3(0);
this.Revised_Inputs_C23=$3(3);
this.Revised_Inputs_C25=$3(0.0485);
this.Revised_Inputs_C27=$3(0.004);
this.Revised_Inputs_C29=$3(65);
this.Revised_Inputs_C3=$3(1000);
this.Revised_Inputs_C31=$3(65);
this.Revised_Inputs_C33=$4("Yes");
this.Revised_Inputs_C38=$3(1.5);
this.Revised_Inputs_C40=$3(8);
this.Revised_Inputs_C42=$3(200);
this.Revised_Inputs_C44=$3(49246);
this.Revised_Inputs_C46=$3(0.01);
this.Revised_Inputs_C5=$3(0.05);
this.Revised_Inputs_D10=$3(96);
this.Revised_Inputs_D12=$3(144);
this.Revised_Inputs_D14=$3(192);
this.Revised_Inputs_D16=$3(288);
this.Revised_Inputs_D18=$3(384);
function $y(){return($A("$y",12)? $B("$y"): $Q("$y",$K($k,$3(1.01))));};
function $z(){return($A("$z",14,7,6,5,4,12,3,8)? $B("$z"): $Q("$z",$T($F($m,$4("yes")),$K($K($3(138),$$),$E($1w,$3(12))),$3(0))));};
function $$(){return($A("$$",7,6,5,4,12,3)? $B("$$"): $Q("$$",$C($C($C($C(($K($k,$b)),($K($k,$c))),($K($k,$d))),($K($k,$e))),($K($k,$f)))));};
function $10(){return($y);};
function $11(){return($1x);};
function $12(){return($27);};
function $13(){return($28);};
function $14(){return($29);};
function $15(){return($2A);};
function $16(){return($1y);};
function $17(){return($1z);};
function $18(){return($2g);};
function $19(){return($A("$19",17,10,9,12)? $B("$19"): $Q("$19",$W($29,$2A,$1z,$3(0))));};
function $1A(){return($A("$1A",12,20,8,11,15,10,9)? $B("$1A"): $Q("$1A",$W($27,$28)));};
function $1B(){return($A("$1B",16,13,12,10,9,8)? $B("$1B"): $Q("$1B",$W($1s)));};
function $1C(){return($20);};
function $1D(){return($A("$1D",25,7,24,6,23,5,22,4,21,12,3,16,13,20,8,11,15,10,9,17,14)? $B("$1D"): $Q("$1D",$V($K($21,$3(12)),$3(0))));};
function $1E(){return($23);};
function $1F(){return($q);};
function $1G(){return($25);};
function $1H(){return($26);};
function $1I(){return($2l);};
function $1J(){return($2m);};
function $1K(){return($2n);};
function $1L(){return($2o);};
function $1M(){return($2h);};
function $1N(){return($2i);};
function $1O(){return($2j);};
function $1P(){return($A("$1P",17,10,9,12,8)? $B("$1P"): $Q("$1P",$W($2n,$2o,$2i,$3(0))));};
function $1Q(){return($A("$1Q",12,20,8,11,15,10,9)? $B("$1Q"): $Q("$1Q",$W($2l,$2m)));};
function $1R(){return($2z);};
function $1S(){return($2$);};
function $1T(){return($30);};
function $1U(){return($31);};
function $1V(){return($2p);};
function $1W(){return($2q);};
function $1X(){return($A("$1X",8,12)? $B("$1X"): $Q("$1X",$T($H($g,$3(3)),$2r,$3(0))));};
function $1Y(){return($2s);};
function $1Z(){return($A("$1Z",17,10,9,12,8)? $B("$1Z"): $Q("$1Z",$W($30,$31,$2q,$1X)));};
function $1a(){return($A("$1a",12,20,8,11,15,10,9)? $B("$1a"): $Q("$1a",$W($2z,$2$)));};
function $1b(){return($m);};
function $1c(){return($n);};
function $1d(){return($o);};
function $1e(){return($p);};
function $1f(){return($q);};
function $1g(){return($r);};
function $1h(){return($22);};
function $1i(){return($1a);};
function $1j(){return($2p);};
function $1k(){return($1Z);};
function $1l(){return($k);};
function $1m(){return($s);};
function $1n(){return($g);};
function $1o(){return($h);};
function $1p(){return($i);};
function $1q(){return($j);};
function $1r(){return($l);};
var $1s=$5($9(3,1,$26,$y,$1x),'$1s',false);
function $1t(){return($A("$1t",11)? $B("$1t"): $Q("$1t",$K($3(0.119394199681239),$j)));};
function $1u(){return($A("$1u",11)? $B("$1u"): $Q("$1u",$K($3(225),$1t)));};
function $1v(){return($A("$1v",20,8,11)? $B("$1v"): $Q("$1v",$K($K($s,$E($1w,$3(12))),$1u)));};
function $1w(){return($A("$1w",8)? $B("$1w"): $Q("$1w",$K($g,$3(12))));};
function $1x(){return($A("$1x",16,13,10,9,12,8)? $B("$1x"): $Q("$1x",$K(($K($K($K($K($k,$o),$l),$3(0.5)),($P($h,$i)))),$E($1w,$3(12)))));};
function $1y(){return($A("$1y",14,7,6,5,4,12,3,8)? $B("$1y"): $Q("$1y",$E(($C($z,$3(0))),($E($1w,$3(12))))));};
function $1z(){return($A("$1z",10,9,12)? $B("$1z"): $Q("$1z",($K($K($k,($P($h,$i))),$3(9)))));};
function $1$(){return($A("$1$",25,7,24,6,23,5,22,4,21,12,3,16,13,20,8,11,15,10,9,17,14)? $B("$1$"): $Q("$1$",$W($32)));};
function $20(){return($A("$20",12,8,20,11,15,10,9,17,14,7,6,5,4,3,25,24,23,22,21,16,13)? $B("$20"): $Q("$20",$C($U($3(0.1),$2D,$2L,$2S,$2Z),$1$)));};
function $21(){return($A("$21",25,7,24,6,23,5,22,4,21,12,3,16,13,20,8,11,15,10,9,17,14)? $B("$21"): $Q("$21",$T($G($2f,$2s),$C($3(3),$E(($P($2f,$2s)),$24)),$P($2u,$2y))));};
function $22(){return($A("$22",19,18,8,12)? $B("$22"): $Q("$22",$K($K($K($q,$r),$g),$k)));};
function $23(){return($A("$23",25,7,24,6,23,5,22,4,21,12,3,16,13,20,8,11,15,10,9,17,14)? $B("$23"): $Q("$23",$W($33)));};
function $24(){return($A("$24",12,20,8,11,15,10,9,17,14,7,6,5,4,3)? $B("$24"): $Q("$24",$C($C($W($34),$1y),$1z)));};
function $25(){return($A("$25",25,7,24,6,23,5,22,4,21,12,3)? $B("$25"): $Q("$25",$L(($C($C($C($C(($K($K($b,$t),$k)),($K($K($c,$u),$k))),($K($K($d,$v),$k))),($K($K($e,$w),$k))),($K($K($f,$x),$k)))))));};
function $26(){return($A("$26",16,13,12)? $B("$26"): $Q("$26",$K($K($K($o,$l),$k),$3(0.5))));};
function $27(){return($A("$27",12,20,8,11)? $B("$27"): $Q("$27",$E(($K($1v,$k)),($E($1w,$3(12))))));};
function $28(){return($A("$28",15,11,10,9,12)? $B("$28"): $Q("$28",$K(($P($h,$i)),($K($K($K($k,$n),$j),$3(8))))));};
function $29(){return($A("$29",17,10,9,12)? $B("$29"): $Q("$29",$K($K(($P($h,$i)),$k),$p)));};
function $2A(){return($A("$2A",10,9,12)? $B("$2A"): $Q("$2A",$K($K($K($3(2),($3(22))),($P($h,$i))),$k)));};
function $2B(){return($A("$2B",8,14,7,6,5,4,12,3)? $B("$2B"): $Q("$2B",$T($G($1w,$3(12)),$E(($C($z,$3(0))),($E($1w,$3(12)))),$3(0))));};
function $2C(){return($A("$2C",10,9,12,8)? $B("$2C"): $Q("$2C",$T($G($1w,$3(12)),($K($K($k,($P($h,$i))),$3(9))),$3(0))));};
function $2D(){return($A("$2D",12,8,20,11,15,10,9,17,14,7,6,5,4,3)? $B("$2D"): $Q("$2D",$W($35)));};
function $2E(){return($A("$2E",12,8,20,11)? $B("$2E"): $Q("$2E",$E(($K($T($G($1w,$3(12)),$1v,$3(0)),$k)),($E($1w,$3(12))))));};
function $2F(){return($A("$2F",8,15,11,10,9,12)? $B("$2F"): $Q("$2F",$T($G($1w,$3(12)),$28,$3(0))));};
function $2G(){return($A("$2G",17,10,9,12,8)? $B("$2G"): $Q("$2G",$T($G($1w,$3(12)),$K($K(($P($h,$i)),$k),$p),$3(0))));};
function $2H(){return($A("$2H",10,9,12,8)? $B("$2H"): $Q("$2H",$T($G($1w,$3(12)),$K($K($K($3(2),($3(22))),($P($h,$i))),$k),$3(0))));};
function $2I(){return($A("$2I",8,14,7,6,5,4,12,3)? $B("$2I"): $Q("$2I",$T($G($1w,$3(24)),$E(($C($z,$3(0))),($E($1w,$3(12)))),$3(0))));};
function $2J(){return($A("$2J",10,9,12,8)? $B("$2J"): $Q("$2J",$T($G($1w,$3(24)),($K($K($k,($P($h,$i))),$3(9))),$3(0))));};
function $2K(){return($A("$2K",12)? $B("$2K"): $Q("$2K",$K($3(49),$k)));};
function $2L(){return($A("$2L",12,8,20,11,15,10,9,17,14,7,6,5,4,3)? $B("$2L"): $Q("$2L",$W($36)));};
function $2M(){return($A("$2M",12,8,20,11)? $B("$2M"): $Q("$2M",$E(($K($T($G($1w,$3(24)),$1v,$3(0)),$k)),($E($1w,$3(12))))));};
function $2N(){return($A("$2N",8,15,11,10,9,12)? $B("$2N"): $Q("$2N",$T($G($1w,$3(24)),$28,$3(0))));};
function $2O(){return($A("$2O",17,10,9,12,8)? $B("$2O"): $Q("$2O",$T($G($1w,$3(24)),$K($K(($P($h,$i)),$k),$p),$3(0))));};
function $2P(){return($A("$2P",10,9,12,8)? $B("$2P"): $Q("$2P",$T($G($1w,$3(24)),$K($K($K($3(2),($3(22))),($P($h,$i))),$k),$3(0))));};
function $2Q(){return($A("$2Q",8,14,7,6,5,4,12,3)? $B("$2Q"): $Q("$2Q",$T($G($1w,$3(36)),$E(($C($z,$3(0))),($E($1w,$3(12)))),$3(0))));};
function $2R(){return($A("$2R",10,9,12,8)? $B("$2R"): $Q("$2R",$T($G($1w,$3(36)),($K($K($k,($P($h,$i))),$3(9))),$3(0))));};
function $2S(){return($A("$2S",12,8,20,11,15,10,9,17,14,7,6,5,4,3)? $B("$2S"): $Q("$2S",$W($37)));};
function $2T(){return($A("$2T",12,8,20,11)? $B("$2T"): $Q("$2T",$E(($K($T($G($1w,$3(36)),$1v,$3(0)),$k)),($E($1w,$3(12))))));};
function $2U(){return($A("$2U",8,15,11,10,9,12)? $B("$2U"): $Q("$2U",$T($G($1w,$3(36)),$28,$3(0))));};
function $2V(){return($A("$2V",17,10,9,12,8)? $B("$2V"): $Q("$2V",$T($G($1w,$3(36)),$K($K(($P($h,$i)),$k),$p),$3(0))));};
function $2W(){return($A("$2W",10,9,12,8)? $B("$2W"): $Q("$2W",$T($G($1w,$3(36)),$K($K($K($3(2),($3(22))),($P($h,$i))),$k),$3(0))));};
function $2X(){return($A("$2X",8,14,7,6,5,4,12,3)? $B("$2X"): $Q("$2X",$T($G($1w,$3(48)),$E(($C($z,$3(0))),($E($1w,$3(12)))),$3(0))));};
function $2Y(){return($A("$2Y",10,9,12,8)? $B("$2Y"): $Q("$2Y",$T($G($1w,$3(48)),($K($K($k,($P($h,$i))),$3(9))),$3(0))));};
function $2Z(){return($A("$2Z",12,8,20,11,15,10,9,17,14,7,6,5,4,3)? $B("$2Z"): $Q("$2Z",$W($38)));};
function $2a(){return($A("$2a",12,8,20,11)? $B("$2a"): $Q("$2a",$E(($K($E($T($G($1w,$3(48)),$1v,$3(0)),($E($1w,$3(12)))),$k)),($E($1w,$3(12))))));};
function $2b(){return($A("$2b",8,15,11,10,9,12)? $B("$2b"): $Q("$2b",$T($G($1w,$3(48)),$28,$3(0))));};
function $2c(){return($A("$2c",17,10,9,12,8)? $B("$2c"): $Q("$2c",$T($G($1w,$3(48)),$K($K(($P($h,$i)),$k),$p),$3(0))));};
function $2d(){return($A("$2d",10,9,12,8)? $B("$2d"): $Q("$2d",$T($G($1w,$3(48)),$K($K($K($3(2),($3(22))),($P($h,$i))),$k),$3(0))));};
function $2e(){return($A("$2e",25,7,24,6,23,5,22,4,21,12,3)? $B("$2e"): $Q("$2e",$W($39)));};
function $2f(){return($A("$2f",25,7,24,6,23,5,22,4,21,12,3)? $B("$2f"): $Q("$2f",$L($2e)));};
function $2g(){return($A("$2g",16,13,12,20,8,11,15,10,9,17,14,7,6,5,4,3)? $B("$2g"): $Q("$2g",$W($3C)));};
function $2h(){return($A("$2h",14,7,6,5,4,12,3,8)? $B("$2h"): $Q("$2h",$C($1y,$2B)));};
function $2i(){return($A("$2i",10,9,12,8)? $B("$2i"): $Q("$2i",$C($1z,$2C)));};
function $2j(){return($A("$2j",16,13,12,20,8,11,15,10,9,17,14,7,6,5,4,3)? $B("$2j"): $Q("$2j",$W($3D)));};
function $2k(){return($A("$2k",16,13,12,20,8,11,15,10,9,17,14,7,6,5,4,3)? $B("$2k"): $Q("$2k",$P($2j,$2g)));};
function $2l(){return($A("$2l",12,20,8,11)? $B("$2l"): $Q("$2l",$C($27,$2E)));};
function $2m(){return($A("$2m",15,11,10,9,12,8)? $B("$2m"): $Q("$2m",$C($28,$2F)));};
function $2n(){return($A("$2n",17,10,9,12,8)? $B("$2n"): $Q("$2n",$C($29,$2G)));};
function $2o(){return($A("$2o",10,9,12,8)? $B("$2o"): $Q("$2o",$C($2A,$2H)));};
function $2p(){return($A("$2p",14,7,6,5,4,12,3,8)? $B("$2p"): $Q("$2p",$C($2h,$2I)));};
function $2q(){return($A("$2q",10,9,12,8)? $B("$2q"): $Q("$2q",$C($2i,$2J)));};
function $2r(){return($A("$2r",12)? $B("$2r"): $Q("$2r",$C($3(0),$2K)));};
function $2s(){return($A("$2s",16,13,12,20,8,11,15,10,9,17,14,7,6,5,4,3)? $B("$2s"): $Q("$2s",$W($3E)));};
function $2t(){return($A("$2t",16,13,12,20,8,11,15,10,9,17,14,7,6,5,4,3)? $B("$2t"): $Q("$2t",$P($2s,$2j)));};
function $2u(){return($A("$2u",16,13,12,20,8,11,15,10,9,17,14,7,6,5,4,3,25,24,23,22,21)? $B("$2u"): $Q("$2u",$C($R($3B,$D($4("<"),$2f)),$3(1))));};
function $2v(){return($A("$2v",16,13,12,20,8,11,15,10,9,17,14,7,6,5,4,3,25,24,23,22,21)? $B("$2v"): $Q("$2v",$S($2u,$3A,$3(2),$2(0))));};
function $2w(){return($A("$2w",16,13,12,20,8,11,15,10,9,17,14,7,6,5,4,3,25,24,23,22,21)? $B("$2w"): $Q("$2w",$S($2u,$3A,$3(3),$2(0))));};
function $2x(){return($A("$2x",16,13,12,20,8,11,15,10,9,17,14,7,6,5,4,3,25,24,23,22,21)? $B("$2x"): $Q("$2x",$P($2v,$2f)));};
function $2y(){return($A("$2y",16,13,12,20,8,11,15,10,9,17,14,7,6,5,4,3,25,24,23,22,21)? $B("$2y"): $Q("$2y",$E($2x,$2w)));};
function $2z(){return($A("$2z",12,20,8,11)? $B("$2z"): $Q("$2z",$C($2l,$2M)));};
function $2$(){return($A("$2$",15,11,10,9,12,8)? $B("$2$"): $Q("$2$",$C($2m,$2N)));};
function $30(){return($A("$30",17,10,9,12,8)? $B("$30"): $Q("$30",$C($2n,$2O)));};
function $31(){return($A("$31",10,9,12,8)? $B("$31"): $Q("$31",$C($2o,$2P)));};
var $32=$5($9(12,1,$25,$26,$y,$27,$28,$29,$2A,$1x,$1y,$1z,$3(0),$3(0)),'$32',false);
var $33=$5($9(11,5,$25,$3(0),$3(0),$3(0),$3(0),$26,$3(0),$3(0),$3(0),$3(0),$y,$3(0),$3(0),$3(0),$3(0),$27,$2E,$2M,$2T,$2a,$28,$2F,$2N,$2U,$2b,$29,$2G,$2O,$2V,$2c,$2A,$2H,$2P,$2W,$2d,$1x,$3(0),$3(0),$3(0),$3(0),$1y,$2B,$2I,$2Q,$2X,$1z,$2C,$2J,$2R,$2Y,$3(0),$3(0),$2K,$3(0),$3(0)),'$33',false);
var $34=$5($9(4,1,$27,$28,$29,$2A),'$34',false);
var $35=$5($9(12,1,$3(0),$3(0),$3(0),$2E,$2F,$2G,$2H,$3(0),$2B,$2C,$3(0),$3(0)),'$35',false);
var $36=$5($9(12,1,$3(0),$3(0),$3(0),$2M,$2N,$2O,$2P,$3(0),$2I,$2J,$2K,$3(0)),'$36',false);
var $37=$5($9(12,1,$3(0),$3(0),$3(0),$2T,$2U,$2V,$2W,$3(0),$2Q,$2R,$3(0),$3(0)),'$37',false);
var $38=$5($9(12,1,$3(0),$3(0),$3(0),$2a,$2b,$2c,$2d,$3(0),$2X,$2Y,$3(0),$3(0)),'$38',false);
var $39=$5($9(12,1,$25,$3(0),$3(0),$3(0),$3(0),$3(0),$3(0),$3(0),$3(0),$3(0),$3(0),$3(0)),'$39',false);
var $3A=$5($9(3,3,$3(1),$3(2),$3(3),$2g,$2j,$2s,$2g,$2k,$2t),'$3A',false);
var $3B=$5($9(1,3,$2g,$2j,$2s),'$3B',false);
var $3C=$5($9(12,1,$3(0),$26,$y,$27,$28,$29,$2A,$1x,$1y,$1z,$3(0),$3(0)),'$3C',false);
var $3D=$5($9(12,1,$3(0),$26,$y,$2l,$2m,$2n,$2o,$1x,$2h,$2i,$3(0),$3(0)),'$3D',false);
var $3E=$5($9(12,1,$3(0),$26,$y,$2z,$2$,$30,$31,$1x,$2p,$2q,$2r,$3(0)),'$3E',false);
function $Y(){return this.ACG_B20;};
function $Z(){return this.ACG_B5;};
function $a(){return this.ACG_C20;};
function $b(){return this.Revised_Inputs_C10;};
function $c(){return this.Revised_Inputs_C12;};
function $d(){return this.Revised_Inputs_C14;};
function $e(){return this.Revised_Inputs_C16;};
function $f(){return this.Revised_Inputs_C18;};
function $g(){return this.Revised_Inputs_C23;};
function $h(){return this.Revised_Inputs_C25;};
function $i(){return this.Revised_Inputs_C27;};
function $j(){return this.Revised_Inputs_C29;};
function $k(){return this.Revised_Inputs_C3;};
function $l(){return this.Revised_Inputs_C31;};
function $m(){return this.Revised_Inputs_C33;};
function $n(){return this.Revised_Inputs_C38;};
function $o(){return this.Revised_Inputs_C40;};
function $p(){return this.Revised_Inputs_C42;};
function $q(){return this.Revised_Inputs_C44;};
function $r(){return this.Revised_Inputs_C46;};
function $s(){return this.Revised_Inputs_C5;};
function $t(){return this.Revised_Inputs_D10;};
function $u(){return this.Revised_Inputs_D12;};
function $v(){return this.Revised_Inputs_D14;};
function $w(){return this.Revised_Inputs_D16;};
function $x(){return this.Revised_Inputs_D18;};
this.ACG_B10=function(){return $X($10());};
this.ACG_B11=function(){return $X($11());};
this.ACG_B14=function(){return $X($12());};
this.ACG_B15=function(){return $X($13());};
this.ACG_B16=function(){return $X($14());};
this.ACG_B17=function(){return $X($15());};
this.ACG_B18=function(){return $X($16());};
this.ACG_B19=function(){return $X($17());};
this.ACG_B21=function(){return $X($18());};
this.ACG_B23=function(){return $X($19());};
this.ACG_B24=function(){return $X($1A());};
this.ACG_B26=function(){return $X($1B());};
this.ACG_B3=function(){return $X($1C());};
this.ACG_B4=function(){return $X($1D());};
this.ACG_B6=function(){return $X($1E());};
this.ACG_B7=function(){return $X($1F());};
this.ACG_B8=function(){return $X($1G());};
this.ACG_B9=function(){return $X($1H());};
this.ACG_C14=function(){return $X($1I());};
this.ACG_C15=function(){return $X($1J());};
this.ACG_C16=function(){return $X($1K());};
this.ACG_C17=function(){return $X($1L());};
this.ACG_C18=function(){return $X($1M());};
this.ACG_C19=function(){return $X($1N());};
this.ACG_C21=function(){return $X($1O());};
this.ACG_C23=function(){return $X($1P());};
this.ACG_C24=function(){return $X($1Q());};
this.ACG_D14=function(){return $X($1R());};
this.ACG_D15=function(){return $X($1S());};
this.ACG_D16=function(){return $X($1T());};
this.ACG_D17=function(){return $X($1U());};
this.ACG_D18=function(){return $X($1V());};
this.ACG_D19=function(){return $X($1W());};
this.ACG_D20=function(){return $X($1X());};
this.ACG_D21=function(){return $X($1Y());};
this.ACG_D23=function(){return $X($1Z());};
this.ACG_D24=function(){return $X($1a());};
this.ACG_G10=function(){return $X($1b());};
this.ACG_G11=function(){return $X($1c());};
this.ACG_G12=function(){return $X($1d());};
this.ACG_G13=function(){return $X($1e());};
this.ACG_G14=function(){return $X($1f());};
this.ACG_G15=function(){return $X($1g());};
this.ACG_G16=function(){return $X($1h());};
this.ACG_G17=function(){return $X($1i());};
this.ACG_G18=function(){return $X($1j());};
this.ACG_G19=function(){return $X($1k());};
this.ACG_G3=function(){return $X($1l());};
this.ACG_G4=function(){return $X($1m());};
this.ACG_G5=function(){return $X($1n());};
this.ACG_G6=function(){return $X($1o());};
this.ACG_G7=function(){return $X($1p());};
this.ACG_G8=function(){return $X($1q());};
this.ACG_G9=function(){return $X($1r());};
var _inps=[$Y,$Z,$a,$b,$c,$d,$e,$f,$g,$h,$i,$j,$k,$l,$m,$n,$o,$p,$q,$r,$s,$t,$u,$v,$w,$x];

var _md={};
function $A()
{
var _b=true;
var _c=arguments[0];
if(_md[_c]==undefined)_md[_c]=[];
    var _la=_md[_c];
for(var _d=1;_d<arguments.length;_d++)
{
var _a=arguments[_d];
var _e=_inps[_a].call(_me);
if(_la[_d]==null||_la[_d].value!=_e.value)
{
_b=false;
_la[_d]=_e;
}
}
    _md[_c]=_la;
return _b;
};


var _mv={};
function $B(_a)
{
return _mv[_a];
};


function $C(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    if(_a.isNumeric()&&_b.isNumeric())return $3(_a.toDouble()+_b.toDouble());
    if(_a.isRange())
{
        _a=_a.toRange(_me);
        if(_b.isRange())_b=_b.toRange(_me);

        if(_a.rows>1&&_a.columns>1)return $8(S2CObject.VALUE_ERR);
        if(_b.columns&&_b.columns>1)return $8(S2CObject.VALUE_ERR);
        var _d=[];
        for(var _r=0;_r<_a.rows;_r++)
{
            var _ar=[];
            for(var _c=0;_c<_a.columns;_c++)
{
                var _an=_a.getObject(_r,0);
                var _bn=_b;
                if(_b.columns)
{
                    if(_b.rows<=_r)break;
                    _bn=_b.getObject(_r,0);
}
                _ar.push($C(_an,_bn));
}
            _d.push(_ar);
}
        var _rn=new S2CArray();
        _rn.data=_d;
        _rn.rows=_d.length;
        _rn.columns=_d[0].length;

        return $5(_rn);
}
    return $8(S2CObject.VALUE_ERR);
};


function $D(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    if(_a.isError()||_a.isRange()||_b.isError()||_b.isRange())return $8(S2CObject.VALUE_ERR);
    if(_a.isDate()&&_b.isDate())return $4(_a.numDays.toString()+_b.numDays.toString());
    if(_a.isDate())return $4(_a.numDays.toString()+_b.toString());
    if(_b.isDate())return $4(_a.toString()+_b.numDays.toString());
    return $4(_a.toString()+_b.toString());
};


function $E(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    if(_a.isNumeric()&&_b.isNumeric())
{
        if(_b.toDouble()==0)return $8(S2CObject.DIV0_ERR);
        return $3(_a.toDouble()/_b.toDouble());
}
    if(_a.isRange())
{
        _a=_a.toRange(_me);
        if(_b.isRange())_b=_b.toRange(_me);

        if(_a.rows>1&&_a.columns>1)return $8(S2CObject.VALUE_ERR);
        if(_b.columns&&_b.columns>1)return $8(S2CObject.VALUE_ERR);
        var _d=[];
        for(var _r=0;_r<_a.rows;_r++)
{
            var _ar=[];
            for(var _c=0;_c<_a.columns;_c++)
{
                var _an=_a.getObject(_r,0);
                var _bn=_b;
                if(_b.columns)
{
                    if(_b.rows<=_r)break;
                    _bn=_b.getObject(_r,0);
}
                _ar.push($E(_an,_bn));
}
            _d.push(_ar);
}
        var _rn=new S2CArray();
        _rn.data=_d;
        _rn.rows=_d.length;
        _rn.columns=_d[0].length;

        return $5(_rn);
}
    return $8(S2CObject.VALUE_ERR);
};


function $F(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    return $2(_a.toString().toLowerCase()==_b.toString().toLowerCase()? 1 : 0);
};


function $G(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    if(_a.isString()||_b.isString())return $2(_a.toString()>_b.toString()? 1 : 0);
    if(_a.isNumeric()&&_b.isNumeric())return $2(_a.toDouble()>_b.toDouble()? 1 : 0);
    if(_a.type!=_b.type)return $2(0);
    if(_a.isDate())return $2(_a.numDays()>_b.numDays()? 1 : 0);
    return $8(S2CObject.VALUE_ERR);
};


function $H(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    if(_a.isString()||_b.isString())return $2(_a.toString()>=_b.toString()? 1 : 0);
    if(_a.isNumeric()&&_b.isNumeric())return $2(_a.toDouble()>=_b.toDouble()? 1 : 0);
    if(_a.type!=_b.type)return $2(0);
    if(_a.isDate())return $2(_a.numDays()>=_b.numDays()? 1 : 0);
    return $8(S2CObject.VALUE_ERR);
};


function $I(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    if(_a.isString()||_b.isString())return $2(_a.toString()<_b.toString()? 1 : 0);
    if(_a.isNumeric()&&_b.isNumeric())return $2(_a.toDouble()<_b.toDouble()? 1 : 0);
    if(_a.type!=_b.type)return $2(0);
    if(_a.isDate())return $2(_a.numDays()<_b.numDays()? 1 : 0);
    return $8(S2CObject.VALUE_ERR);
};


function $J(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    if(_a.isString()||_b.isString())return $2(_a.toString()<=_b.toString()? 1 : 0);
    if(_a.isNumeric()&&_b.isNumeric())return $2(_a.toDouble()<=_b.toDouble()? 1 : 0);
    if(_a.type!=_b.type)return $2(0);
    if(_a.isDate())return $2(_a.numDays()<=_b.numDays()? 1 : 0);
    return $8(S2CObject.VALUE_ERR);
};


function $K(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    if(_a.isNumeric()&&_b.isNumeric())return $3(_a.toDouble()*_b.toDouble());
    if(_a.isRange())
{
        _a=_a.toRange(_me);
        if(_b.isRange())_b=_b.toRange(_me);

        if(_a.rows>1&&_a.columns>1)return $8(S2CObject.VALUE_ERR);
        if(_b.columns&&_b.columns>1)return $8(S2CObject.VALUE_ERR);
        var _d=[];
        for(var _r=0;_r<_a.rows;_r++)
{
            var _ar=[];
            for(var _c=0;_c<_a.columns;_c++)
{
                var _an=_a.getObject(_r,0);
                var _bn=_b;
                if(_b.columns)
{
                    if(_b.rows<=_r)break;
                    _bn=_b.getObject(_r,0);
}
                _ar.push($K(_an,_bn));
}
            _d.push(_ar);
}
        var _rn=new S2CArray();
        _rn.data=_d;
        _rn.rows=_d.length;
        _rn.columns=_d[0].length;

        return $5(_rn);
}
    return $8(S2CObject.VALUE_ERR);
};


function $L(_a)
{
    _a=$X(_a);
    if(_a.isNumeric())return $3(0-_a.toDouble());
    else return $8(S2CObject.VALUE_ERR);
};


function $M(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    if(_a.type!=_b.type)return $2(1);
    if(_a.isNumeric())return $2(_a.toDouble()!=_b.toDouble()? 1 : 0);
    if(_a.isString())return $2(_a.toString()!=_b.toString()? 1 : 0);
    if(_a.isDate())return $2(_a.numDays()!=_b.numDays()? 1 : 0);
    return $8(S2CObject.VALUE_ERR);
};


function $N(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    if(_a.isNumeric())return $3(_a.toDouble()/100.0);
    else return $8(S2CObject.VALUE_ERR);
};


function $O(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    if(_a.isNumeric()&&_b.isNumeric())return $3(Math.pow(_a.toDouble(),_b.toDouble()));
    else return $8(S2CObject.VALUE_ERR);
};


function $P(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    if(_a.isNumeric()&&_b.isNumeric())return $3(_a.toDouble()-_b.toDouble());
    if(_a.isRange())
{
        _a=_a.toRange(_me);
        if(_b.isRange())_b=_b.toRange(_me);

        if(_a.rows>1&&_a.columns>1)return $8(S2CObject.VALUE_ERR);
        if(_b.columns&&_b.columns>1)return $8(S2CObject.VALUE_ERR);
        var _d=[];
        for(var _r=0;_r<_a.rows;_r++)
{
            var _ar=[];
            for(var _c=0;_c<_a.columns;_c++)
{
                var _an=_a.getObject(_r,0);
                var _bn=_b;
                if(_b.columns)
{
                    if(_b.rows<=_r)break;
                    _bn=_b.getObject(_r,0);
}
                _ar.push($P(_an,_bn));
}
            _d.push(_ar);
}
        var _rn=new S2CArray();
        _rn.data=_d;
        _rn.rows=_d.length;
        _rn.columns=_d[0].length;

        return $5(_rn);
}
    return $8(S2CObject.VALUE_ERR);
};


function $Q(_a,_b)
{
_mv[_a]=_b;
    return _b;
};


function $R(_a,_b)
{
    _a=$X(_a);
    _b=$X(_b);
    var _r=0;
    var _c=0;
    var _d=_a.toRange(_me);
    var _e;
var _f=0;
    if(!_b.isString())
{
        for(_r=0;_r<_d.rows;_r++)
{
for(_c=0;_c<_d.columns;_c++)
{
_e=_d.getObject(_r,_c);
                if($F(_e,_b).toInt()==1)_f++;
}
}
}
    else if(_b.toString().indexOf('>=')==0)
{
        var _j=$4(_b.toString().substr(2));
if(!isNaN(_j.toString()))_j=$3(_j.toString());
for(_r=0;_r<_d.rows;_r++)
{
for(_c=0;_c<_d.columns;_c++)
{
_e=_d.getObject(_r,_c);
                if($H(_e,_j).toInt()==1)_f++;
}
}
}
else if(_b.toString().indexOf('<=')==0)
{
        var _k=$4(_b.toString().substr(2));
if(!isNaN(_k.toString()))_k=$3(_k.toString());
for(_r=0;_r<_d.rows;_r++)
{
for(_c=0;_c<_d.columns;_c++)
{
_e=_d.getObject(_r,_c);
                if($J(_e,_k).toInt()==1)_f++;
}
}
}
else if(_b.toString().indexOf('<>')==0)
{
        var _l=$4(_b.toString().substr(2));
if(!isNaN(_l.toString()))_l=$3(_l.toString());
for(_r=0;_r<_d.rows;_r++)
{
for(_c=0;_c<_d.columns;_c++)
{
_e=_d.getObject(_r,_c);
                if($M(_e,_l).toInt()==1)_f++;
}
}
}
else if(_b.toString().indexOf('>')==0)
{
        var _m=$4(_b.toString().substr(1));
if(!isNaN(_m.toString()))_m=$3(_m.toString());
for(_r=0;_r<_d.rows;_r++)
{
for(_c=0;_c<_d.columns;_c++)
{
_e=_d.getObject(_r,_c);
                if($G(_e,_m).toInt()==1)_f++;
}
}
}
else if(_b.toString().indexOf('<')==0)
{
        var _g=$4(_b.toString().substr(1));
if(!isNaN(_g.toString()))_g=$3(_g.toString());
for(_r=0;_r<_d.rows;_r++)
{
for(_c=0;_c<_d.columns;_c++)
{
_e=_d.getObject(_r,_c);
                if($I(_e,_g).toInt()==1)_f++;
}
}
}
else if(_b.toString().indexOf('=')==0)
{
        var _h=$4(_b.toString().substr(1));
if(!isNaN(_h.toString()))_h=$3(_h.toString());
for(_r=0;_r<_d.rows;_r++)
{
for(_c=0;_c<_d.columns;_c++)
{
_e=_d.getObject(_r,_c);
                if($F(_e,_h).toInt()==1)_f++;
}
}
}
else
{
for(_r=0;_r<_d.rows;_r++)
{
for(_c=0;_c<_d.columns;_c++)
{
_e=_d.getObject(_r,_c);
                if($F(_e,_b).toInt()==1)_f++;
}
}
}
 
    return $3(_f);
};


function $S(_a,_b,_d,_e)
{
    _a=$X(_a);
    _b=$X(_b);
    _d=$X(_d);
    _e=$X(_e);

    if(_a.isRange()||_a.isArray())return $8(S2CObject.VALUE_ERR);

    if(!_d.isNumeric())return $8(S2CObject.VALUE_ERR);

    var _o=(_e==null)? true : _e.toInt()!=0;

    var _f=_b.toRange(_me);
    var _g=_d.toInt();

    if(_g>_f.rows)return $8(S2CObject.REF_ERR);

    var _h=-1;
    var _j=null;

    for(var _c=0;_c<_f.columns;_c++)
{
        var _n=_f.getObject(0,_c);
        var _k=$F(_n,_a);
        if(_k.toInt()==1)
{
            _h=_c;
            break;
}
        else
{
            var _l=$J(_n,_a);
            if(_o&&_l.toInt()==1)
{
                if(_j)
{
                    var _m=$G(_n,_j);
                    if(_m.toInt()==1)
{
                        _h=_c;
                        _j=_n;
}
}
                else
{
                    _h=_c;
                    _j=_n;
}
}
}
}
    if(_h<0)return $8(S2CObject.NA_ERR);
    return _f.getObject(_g-1,_h);
};


function $T()
{
    var _d;
    var _a=$X(arguments[0]);
    var _b=$X(arguments[1]);
    var _c=(arguments.length>2)? $X(arguments[2]): $2(0);

    if(_a.isNumeric())_d=_a.toDouble()!=0;
    else if(_a.isString())
{
        if(_a.toString().toLower()=="true")_d=true;
        else if(_a.toString().toLower()=="false")_d=false;
        else return $8(S2CObject.VALUE_ERR);
}
    else return $8(S2CObject.VALUE_ERR);

    if(_d)return _b;
    return _c;
};


function $U(_a)
{
    _a=$X(_a);
    if(!_a.isNumeric())return $8(S2CObject.VALUE_ERR);
    var _b=_a.toDouble();
    var _c=0;

    var _d;
    var _e=0;

    for(var _i=1;_i<arguments.length;_i++)
{
        _d=$X(arguments[_i]);
        if(_d==null)continue;
        var _f=_d.toRange(_me);
        for(var _g=0;_g<_f.rows;_g++)
{
            for(var _h=0;_h<_f.columns;_h++)
{
                var _j=_f.getObject(_g,_h);
                if(_j.isNumeric())
{
                    _c+=(_j.toDouble()/Math.pow(1+_b,_e+1));
                    _e=_e+1;
}
}
}
}
    return $3(_c);
};


function $V(_a,_b)
{
    if(_b==null)b=$3(0);
    _a=$X(_a);
    _b=$X(_b);
    if(_a.isNumeric()&&_b.isNumeric())
{
        var _c=_a.toDouble();
        var _d=_b.toDouble();
        var _e=Math.pow(10,_d);
        if(_c>=0)return $3(Math.ceil(_c*_e)/_e);
else return $3(Math.floor(_c*_e)/_e);
}
    return $8(S2CObject.VALUE_ERR);
};


function $W()
{
    var _s=0;
    for(var _i=0;_i<arguments.length;_i++)
{
var _a=$X(arguments[_i]);
var _b=_a.toRange(_me);
for(var _r=0;_r<_b.rows;_r++)
    for(var _c=0;_c<_b.columns;_c++)
{
var _p=_b.getObject(_r,_c);
if(_p.isNumeric())_s+=_p.toDouble();
}
}
    return $3(_s);
};

function $X(_a){while(typeof(_a)=='function')_a=_a.call(_me);return _a;};
}