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
                    [57.69, 11.91],
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
                        // There is one angle in tolernace.
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

            it('should merge segments whose negative angle in tolerance', function() {
                var polygon = L.polygon([
                        // There is three angle in tolernace.
                        [22.722, 120.2121],
                        [22.7348, 120.1986],
                        [22.747, 120.2104],
                        [22.744, 120.2134],
                        [22.7405, 120.217],
                        [22.7374, 120.2201],
                        [22.7345, 120.223],
                        [22.7329, 120.2246],
                    ],
                    {
                        showMeasurements: true,
                        measurementOptions: {
                            minPixelDistance: 0,
                            angleTolerance: 15
                        }
                    })
                    .addTo(map);

                expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(5);
            })

            describe('edge case', function() {
                it('should not merge segments of one straight line attaching one arc', function() {
                    var polyline = L.polyline([
                            // arc
                            [25.073875, 121.605939],
                            [25.073871, 121.605918],
                            [25.073871, 121.605897],
                            [25.073875, 121.605877],
                            [25.07388, 121.605858],
                            [25.073883, 121.605838],
                            [25.073887, 121.605818],
                            [25.073889, 121.605798],
                            [25.073891, 121.605778],
                            [25.073892, 121.605758],
                            [25.073893, 121.605738],
                            [25.073893, 121.605717],
                            [25.073892, 121.605697],
                            [25.073891, 121.605677],
                            [25.07389, 121.605657],
                            [25.073887, 121.605637],
                            [25.073884, 121.605617],
                            [25.07388, 121.605597],
                            [25.073876, 121.605578],
                            [25.073871, 121.605558],
                            [25.073866, 121.605539],
                            [25.07386, 121.60552],
                            [25.073853, 121.605501],
                            // straight line
                            [25.073912, 121.605341],
                            [25.073929, 121.605301],
                        ],
                        {
                            showMeasurements: true,
                            measurementOptions: {
                                minPixelDistance: 0,
                                angleTolerance: 30
                            }
                        })
                        .addTo(map);

                    expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(2);
                })

                it('should merge segments of two straight line attaching one arc', function() {
                    var polyline = L.polyline([
                            // straight line
                            [25.073101, 121.606574],
                            [25.07322, 121.606325],
                            // arc
                            [25.073225, 121.606322],
                            [25.073229, 121.60632],
                            [25.073233, 121.606317],
                            [25.073238, 121.606316],
                            [25.073242, 121.606314],
                            [25.073247, 121.606313],
                            [25.073252, 121.606312],
                            [25.073257, 121.606312],
                            [25.073262, 121.606312],
                            // straight line
                            [25.073266, 121.606313],
                            [25.073395, 121.606318],
                        ],
                        {
                            showMeasurements: true,
                            measurementOptions: {
                                minPixelDistance: 0,
                                angleTolerance: 30
                            }
                        })
                        .addTo(map);

                    expect(document.querySelectorAll('.leaflet-measure-path-measurement').length).to.be(4);
                })
            });
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
                L.latLng([57.69, 11.91]),
            ];
            polygon.updateMeasurements();
            var measurements=document.querySelectorAll('.leaflet-measure-path-measurement');
            expect(measurements.length).to.be(6);
            expect(measurements[5].style.transform).to.be('translate3d(482px, 50px, 0px) rotate(0rad)');
        });

        it('should update measurements with latlngs of mutiple polygons', function() {
            var polygon = L.polygon([
                    [[57.69, 11.89],
                     [57.697, 11.88],
                     [57.71, 11.89]],
                    [[58.69, 11.89],
                     [58.697, 11.88],
                     [58.71, 11.89]],
                ], {showMeasurements: true, measurementOptions: { minPixelDistance: 0 }})
                .addTo(map);

            polygon.updateMeasurements();
            var measurements=document.querySelectorAll('.leaflet-measure-path-measurement');
            expect(measurements.length).to.be(8);
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
