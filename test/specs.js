describe('leaflet-measure-path', function() {
    var div,
        map;

    beforeEach(function () {
        div = document.createElement('div');
        div.style.height = '100px';
        document.body.appendChild(div);

        map = L.map(div).setView([57.7, 11.9], 12);
    });

    afterEach(function () {
        map.remove();
        document.body.removeChild(div);
    });

    describe('Polyline', function() {
        describe('#setLatLngs', function() {
            it('should update latlngs without measurements', function() {
                var polygon = L.polygon([
                        [57.69, 11.89],
                        [57.697, 11.88],
                        [57.71, 11.89],
                    ])
                    .addTo(map);
                polygon.setLatLngs([
                    [57.69, 11.89],
                    [57.697, 11.88],
                    [57.71, 11.89],
                    [57.71, 11.91],
                    [57.69, 11.91]
                ]);
                var latLngs = polygon.getLatLngs();
                expect(latLngs.length).to.be(1);
                expect(latLngs[0].length).to.be(5);
            })
        });

        describe('#showOnHover', function() {
            it('should not add measurements', function() {
                var polygon = L.polygon([
                        [57.69, 11.89],
                        [57.697, 11.88],
                        [57.71, 11.89],
                    ],
                    {
                        showMeasurements: true,
                        measurementOptions: {
                            minPixelDistance: 0,
                            showOnHover: true
                        }
                    })
                    .addTo(map);

                expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(0);
            });

            it('should add measurements on mouseover', function() {
                var polygon = L.polygon([
                        [57.69, 11.89],
                        [57.697, 11.88],
                        [57.71, 11.89],
                    ],
                    {
                        showMeasurements: true,
                        measurementOptions: {
                            minPixelDistance: 0,
                            showOnHover: true
                        }
                    })
                    .addTo(map);
                
                polygon.fire('mouseover');
                expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(4);
            });

            it('should remove measurements on mouseout', function() {
                var polygon = L.polygon([
                        [57.69, 11.89],
                        [57.697, 11.88],
                        [57.71, 11.89],
                    ],
                    {
                        showMeasurements: true,
                        measurementOptions: {
                            minPixelDistance: 0,
                            showOnHover: true
                        }
                    })
                    .addTo(map);
                
                polygon.fire('mouseover');
                polygon.fire('mouseout');
                expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(0);
            });
        });

        describe('#showOnMinPixelDistance', function() {
            it('should show measurements on min distance', function() {
                var polygon = L.polygon([
                        // There is two segment longer than minPixelDistance.
                        [57.69, 11.89],
                        [57.697, 11.88],
                        [57.71, 11.89],
                    ],
                    {
                        showMeasurements: true,
                        measurementOptions: {
                            minPixelDistance: 100,
                            showOnMinPixelDistance: true
                        }
                    })
                    .addTo(map);

                expect(document.querySelectorAll('.margin-on-min-distance').length).to.be(2);
            })
        });

        describe('#showVertex', function() {
            it('should show vertex', function() {
                var polygon = L.polygon([
                        [57.69, 11.89],
                        [57.697, 11.88],
                        [57.71, 11.89],
                    ],
                    {
                        showMeasurements: true,
                        measurementOptions: {
                            minPixelDistance: 0,
                            showVertex: true
                        }
                    })
                    .addTo(map);

                expect(document.querySelectorAll('.leaflet-marker-icon').length).to.be(6);
            })
        });

        describe('#angleTolerance', function() {
            it('should merge segments whose angle in tolerance', function() {
                var polygon = L.polygon([
                        // There is two angle in tolernace.
                        [57.69, 11.89],
                        [57.697, 11.88],
                        [57.71, 11.89],
                        [57.71, 11.91],
                        [57.69, 11.91]
                    ],
                    {
                        showMeasurements: true,
                        measurementOptions: {
                            minPixelDistance: 0,
                            angleTolerance: 60
                        }
                    })
                    .addTo(map);

                expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(4);
            })
        });

        it('should add measurements', function() {
            var polygon = L.polygon([
                    [57.69, 11.89],
                    [57.697, 11.88],
                    [57.71, 11.89],
                ], {showMeasurements: true, measurementOptions: { minPixelDistance: 0 }})
                .addTo(map);

            expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(4);
        });

        it('should remove measurements', function() {
            var polygon = L.polygon([
                    [57.69, 11.89],
                    [57.697, 11.88],
                    [57.71, 11.89],
                ], {showMeasurements: true, measurementOptions: { minPixelDistance: 0 }})
                .addTo(map);

            map.removeLayer(polygon);
            expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(0);
        });

        it('should update measurements with latlngs of polygon', function() {
            var polygon = L.polygon([
                    [57.69, 11.89],
                    [57.697, 11.88],
                    [57.71, 11.89],
                ], {showMeasurements: true, measurementOptions: { minPixelDistance: 0 }})
                .addTo(map);

            polygon._latlngs = [
                L.latLng([57.69, 11.89]),
                L.latLng([57.697, 11.88]),
                L.latLng([57.71, 11.89]),
                L.latLng([57.71, 11.91]),
                L.latLng([57.69, 11.91])
            ];
            polygon.updateMeasurements();
            var measurements=document.querySelectorAll('.leaflet-measure-path-measurement');
            expect(measurements.length).to.be(6);
            expect(measurements[5].style.transform).to.be('translate3d(706px, 50px, 0px) rotate(0rad)');
        });
    })

    describe('Circle', function() {
        describe('#setLatLng', function() {
            it('should update latlng without measurements', function() {
                var circle = L.circle([57.69, 11.89], 200)
                    .addTo(map);
                circle.setLatLng([57.69, 11.91]);
                expect(circle.getLatLng().lat).to.be(57.69);
                expect(circle.getLatLng().lng).to.be(11.91);
            })

            it('should not break method chaining', function() {
                var circle = L.circle([57.69, 11.89], 200)
                    .addTo(map);
                circle.setLatLng([57.69, 11.91])
                    .setRadius(300);
                expect(circle.getLatLng().lat).to.be(57.69);
                expect(circle.getLatLng().lng).to.be(11.91);
                expect(circle.getRadius()).to.be(300);
            })
        });

        describe('#showOnHover', function() {
            it('should not add measurements', function() {
                var circle = L.circle([57.69, 11.89], 200,
                    {
                        showMeasurements: true,
                        measurementOptions: {
                            minPixelDistance: 0,
                            showOnHover: true
                        }
                    })
                    .addTo(map);

                expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(0);
            });

            it('should add measurements on mouseover', function() {
                var circle = L.circle([57.69, 11.89], 200,
                    {
                        showMeasurements: true,
                        measurementOptions: {
                            minPixelDistance: 0,
                            showOnHover: true
                        }
                    })
                    .addTo(map);
                
                circle.fire('mouseover');
                expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(1);
            });

            it('should remove measurements on mouseout', function() {
                var circle = L.circle([57.69, 11.89], 200,
                    {
                        showMeasurements: true,
                        measurementOptions: {
                            minPixelDistance: 0,
                            showOnHover: true
                        }
                    })
                    .addTo(map);
                
                circle.fire('mouseover');
                circle.fire('mouseout');
                expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(0);
            });
        });

        it('should add measurements', function() {
            L.circle([57.69, 11.89], 200,
                {
                    showMeasurements: true,
                    measurementOptions: { minPixelDistance: 0 }
                })
                .addTo(map);

            expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(1);
        });

        it('should remove measurements', function() {
            var circle = L.circle([57.69, 11.89], 200,
                {
                    showMeasurements: true,
                    measurementOptions: { minPixelDistance: 0 }
                })
                .addTo(map);

            map.removeLayer(circle);
            expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(0);
        });
    })
});
