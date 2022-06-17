class Scene {
    constructor(scene) {
        this.scene = new Parser.Race(scene_0);
        this.trackObj = new TrackMaker_texCoords(this.scene.track,0.2);
        this.bbox = scene.bbox;
        this.quad = [this.bbox[0], this.bbox[1] - 0.01, this.bbox[5],
                    this.bbox[3], this.bbox[1] - 0.01, this.bbox[5],
                    this.bbox[3], this.bbox[1] - 0.01, this.bbox[2],
                    this.bbox[0], this.bbox[1] - 0.01, this.bbox[2],
        ];
        console.log(this.bbox);
        this.groundObj = new QuadGround(this.quad, 10);
        this.scene.buildingObjs = new Array(this.scene.buildings.length);
        this.scene.buildingsObjTex  = new Array(this.scene.buildings.length);

        for (var i = 0; i < this.scene.buildings.length; ++i){
            this.scene.buildingObjs[i] = new BuildingMaker(this.scene.buildings[i],0.1);
            this.scene.buildingsObjTex[i] = new BuildingMaker_texCoordsFacades(this.scene.buildings[i],0.1);
            this.scene.buildingsObjTex[i].roof = new BuildingMaker_texCoordsRoof(this.scene.buildings[i],1.0);
        }
    }
}