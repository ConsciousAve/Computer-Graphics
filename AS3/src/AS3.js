main( );
var bgrflag = 0;

function NormalisedToDevice( coord, axisSize )
{
	var halfAxisSize = axisSize / 2;

	var deviceCoord = ( coord + 1 ) * halfAxisSize;

	return deviceCoord;
}

function DeviceToNormalised( coord, axisSize )
{
	var halfAxisSize = axisSize / 2;

	var normalisedCoord = ( coord / halfAxisSize ) - 1;

	return normalisedCoord;
}
function rgbswap() {
 bgrflag++;
 if (bgrflag>1) bgrflag = 0;
 console.log('bgrflag = d%', bgrflag);
}
function main( )
{
	const canvas = document.querySelector( "#glcanvas" );

	const gl = canvas.getContext( "webgl" );

	if ( !gl )
	{
		alert( "Unable to setup WebGL. Your browser or computer may not support it." );

		return;
	}

	var vertices = [
		0.0, 0.0, 0.0, // 4th - 3
    	1.0, 0.0, 0.0, // 2nd - 1
    	0.75, 0.5, 0.0, // 1st - 0
    	0.25, 0.75, 0.0, // 4th - 3
    	-0.25, 0.75, 0.0, // 3rd - 2
    	-0.75, 0.5, 0.0,
        -1.0,0.0,0.0,
        -0.75, -0.5, 0.0,
        -0.25, -0.75,0.0,
        0.25, -0.75, 0.0,
        0.75, -0.5,0.0,
        1.0,0.0,0.0, // 2nd - 1
    ];

    var colors = [
    	0.0, 1.0, 1.0,
    	1.0, 1.0, 1.0,
    	1.0, 1.0, 1.0,
    	0.0, 1.0, 0.0,
    	0.0, 0.0, 1.0, 
    	1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
    	1.0, 0.0, 1.0,
    	0.0, 1.0, 1.0,
    	2.0, 0.0, 0.0,
    	0.0, 2.0, 0.0,
    	0.0, 0.0, 2.0,
    ];
    var ANGLE = 45.0;
    var radian = Math.PI * ANGLE / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    var u_TransMatrix = [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1,
    ];
    var u_TransMatrix2 = [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1,
    ];
   
	var vertex_buffer = gl.createBuffer( );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );

	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	gl.bindBuffer( gl.ARRAY_BUFFER, null );


    // Unbind the buffer
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );

    var color_buffer = gl.createBuffer( );

    gl.bindBuffer( gl.ARRAY_BUFFER, color_buffer );

    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colors ), gl.STATIC_DRAW );

	var vertCode = 
        'uniform mat4 u_TransMatrix2;' +
        'uniform mat4 u_TransMatrix;' +
		'attribute vec3 coordinates;' +
		'attribute vec3 color;' +
		'varying vec3 vColor;' +
		'void main(void)' +
		'{' +
			' gl_Position = u_TransMatrix2 * u_TransMatrix * vec4(coordinates, 1.0);' +
			'vColor = color;'+
		'}';

	var vertShader = gl.createShader( gl.VERTEX_SHADER );

	gl.shaderSource( vertShader, vertCode );

	gl.compileShader( vertShader );

	var fragCode = 
		'precision highp float;' +
		'varying vec3 vColor;' +
        'uniform vec4 u_bgr;' +
		'void main(void)' +
		'{' +
			' gl_FragColor = vec4(vColor, 0.1);' +
            
		'}';

	var fragShader = gl.createShader( gl.FRAGMENT_SHADER );

	gl.shaderSource( fragShader, fragCode );

	gl.compileShader( fragShader );

	var shaderProgram = gl.createProgram( );

	gl.attachShader( shaderProgram, vertShader );

	gl.attachShader( shaderProgram, fragShader );

	gl.linkProgram( shaderProgram );

	gl.useProgram( shaderProgram );

	gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer );

	var coord = gl.getAttribLocation( shaderProgram, "coordinates" );
    // Define trans matrix
    var uTrans = gl.getUniformLocation( shaderProgram, "u_TransMatrix");
    gl.uniformMatrix4fv(uTrans, false, u_TransMatrix);
	gl.vertexAttribPointer( coord, 3, gl.FLOAT, false, 0, 0 );

    var uTrans2 = gl.getUniformLocation( shaderProgram, "u_TransMatrix2");
    gl.uniformMatrix4fv(uTrans2, false, u_TransMatrix2 );
    

	gl.enableVertexAttribArray( coord );

	gl.bindBuffer( gl.ARRAY_BUFFER, color_buffer );

	var color = gl.getAttribLocation( shaderProgram, "color" );

	gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 0, 0 );

	gl.enableVertexAttribArray( color );

	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

	gl.enable( gl.DEPTH_TEST );

	gl.clear( gl.COLOR_BUFFER_BIT );

	gl.viewport( 0, 0, canvas.width, canvas.height );
    
	
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 12);
    gl.drawArrays(gl.POINTS, 0, 12);
	
	var ZoomOutBtn = document.getElementById('ZoomOutButton');
	ZoomOutBtn.addEventListener('click', zoomOut);
}
