$(function() {

  if (!Detector.webgl)
    Detector.addGetWebGLMessage();

  var camera, scene, renderer, light1, light2, light3, light4, light5, light6;

  var FAR = 300;
  var lightingID = 10;

  Math.seedrandom("Three.js lighting renderer seed");
  init();
  animate();

  function init() {

    var container = $("<div/>").appendTo($('body'))[0];

    // CAMERA

    camera = new THREE.PerspectiveCamera(50, 256 / 256, 1, FAR);
    camera.position.set(0, 15, 150);
    camera.lookAt(new THREE.Vector3());

    // SCENE

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x040306, 10, FAR);

    // TEXTURES

    var textureLoader = new THREE.TextureLoader();

    var texture = textureLoader.load("./three/disturb.jpg");
    texture.repeat.set(20, 10);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.format = THREE.RGBFormat;

    // MATERIALS

    var groundMaterial =
        new THREE.MeshPhongMaterial({color : 0xffffff, map : texture});
    var objectMaterial = new THREE.MeshStandardMaterial(
        {color : 0xffffff, roughness : 0.5, metalness : 1.0});

    // GROUND

    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(800, 400, 2, 2),
                              groundMaterial);
    mesh.position.y = -5;
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    // OBJECTS

    // var objectGeometry = new THREE.BoxGeometry( 0.5, 1, 1 );
    // var objectGeometry = new THREE.SphereGeometry( 1.5, 16, 8 );
    var objectGeometry = new THREE.TorusGeometry(1.5, 0.4, 8, 16);

    for (var i = 0; i < 5000; i++) {

      var mesh = new THREE.Mesh(objectGeometry, objectMaterial);

      mesh.position.x = 400 * (0.5 - Math.random());
      mesh.position.y = 50 * (0.5 - Math.random()) + 25;
      mesh.position.z = 200 * (0.5 - Math.random());

      mesh.rotation.y = 3.14 * (0.5 - Math.random());
      mesh.rotation.x = 3.14 * (0.5 - Math.random());

      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      scene.add(mesh);
    }

    // LIGHTS

    var intensity = 2.5;
    var distance = 100;
    var decay = 2.0;

    var c1 = 0xff0040, c2 = 0x0040ff, c3 = 0x80ff80, c4 = 0xffaa00,
        c5 = 0x00ffaa, c6 = 0xff1100;

    var sphere = new THREE.SphereGeometry(0.25, 16, 8);

    light1 = new THREE.PointLight(c1, intensity, distance, decay);
    light1.add(
        new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color : c1})));
    scene.add(light1);

    light2 = new THREE.PointLight(c2, intensity, distance, decay);
    light2.add(
        new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color : c2})));
    scene.add(light2);

    light3 = new THREE.PointLight(c3, intensity, distance, decay);
    light3.add(
        new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color : c3})));
    scene.add(light3);

    light4 = new THREE.PointLight(c4, intensity, distance, decay);
    light4.add(
        new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color : c4})));
    scene.add(light4);

    light5 = new THREE.PointLight(c5, intensity, distance, decay);
    light5.add(
        new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color : c5})));
    scene.add(light5);

    light6 = new THREE.PointLight(c6, intensity, distance, decay);
    light6.add(
        new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color : c6})));
    scene.add(light6);

    var dlight = new THREE.DirectionalLight(0xffffff, 0.05);
    dlight.position.set(0.5, 1, 0).normalize();
    scene.add(dlight);

    // RENDERER

    renderer = new THREE.WebGLRenderer({
      antialias : false,
      preserveDrawingBuffer : true,
      willReadFrequently : false,
      depth : true
    });
    renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(1);
    renderer.setSize(256, 256);
    container.appendChild(renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    window.addEventListener('resize', onWindowResize, false);
  }

  function onWindowResize() {

    camera.aspect = 256 / 256;
    camera.updateProjectionMatrix();

    renderer.setSize(256, 256);
  }

  //

  function animate() {

    requestAnimationFrame(animate);

    render();
  }
  var freq = 0.035;
  var level = 0;
  var distance = 75;
  function render() {

    light1.position.x = Math.sin(freq * level * 0.7) * distance;
    light1.position.z = Math.cos(freq * level * 0.3) * distance;

    light2.position.x = Math.cos(freq * level * 0.3) * distance;
    light2.position.z = Math.sin(freq * level * 0.7) * distance;

    light3.position.x = Math.sin(freq * level * 0.7) * distance;
    light3.position.z = Math.sin(freq * level * 0.5) * distance;

    light4.position.x = Math.sin(freq * level * 0.3) * distance;
    light4.position.z = Math.sin(freq * level * 0.5) * distance;

    light5.position.x = Math.cos(freq * level * 0.3) * distance;
    light5.position.z = Math.sin(freq * level * 0.5) * distance;

    light6.position.x = Math.cos(freq * level * 0.7) * distance;
    light6.position.z = Math.cos(freq * level * 0.5) * distance;
    ++level;

    renderer.render(scene, camera);

    if (level == 50) {
      var ven, ren;
      var gl = renderer.getContext();
      var pixels = new Uint8Array(256*256*4);
      gl.readPixels(0,0,256,256, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if(debugInfo){
          ven = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          ren = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }else{
          console.log("debugInfo is not accessable");
          ven = 'No debug Info';
          ren = 'No debug Info';
      }
      var hash = pixels.hashCode();
      console.log("Three Lighting: " + hash);
      toServer(true, ven, ren, hash, lightingID, pixels);
    }
  }
});