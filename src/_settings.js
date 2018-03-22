// Default Settings
var settings = {
  connectDistance : {type: 'slider', value: '0.1', title: 'これ以下の距離なら連結する', helpTip: '単位：ピクセル'},
  rbMerge         : {type: 'radiobutton', title: '連結対象', items: ['他のパスとの連結', '同じパスの両端を連結', '両方']},
  rbConnect       : {type: 'radiobutton', title: '連結方法', items: ['2点を中間位置に移動', '2点を繋ぐ線を追加']},
  _panelAngle     : {type  : 'panel', title : '縦軸・横軸で対の角度のパスに絞る', items : {
    vertical        : {type: 'checkbox', value: false, title: '縦軸', group: 'angle'},
    horizontal      : {type: 'checkbox', value: false, title: '横軸', group: 'angle'},
    gapAllowDeg     : {type: 'edittext', value: '0', title: '角度差の許容量', helpTip: '単位：度'},
  }},
  _panelAttr      : {type  : 'panel', title : 'プロパティが一致するパスに絞る', items : {
    _strokeWidth      : {type: 'checkbox', value: false, title: '線の太さ', group: 'stroke1', name: 'attr'},
    _strokeColor      : {type: 'checkbox', value: false, title: '線の色', group: 'stroke1', name: 'attr', equals: 'equalsObject'},
    _filled           : {type: 'checkbox', value: false, title: '塗りの有無', group: 'fill', name: 'attr'},
    _fillColor        : {type: 'checkbox', value: false, title: '塗りの色', group: 'fill', name: 'attr', equals: 'equalsObject'},
    _strokeCap        : {type: 'checkbox', value: false, title: '線端の形', group: 'stroke2', name: 'attr'},
    _strokeDashes     : {type: 'checkbox', value: false, title: '破線（線分・間隔）', group: 'stroke2', name: 'attr', equals: 'equalsArray'},
    _strokeJoin       : {type: 'checkbox', value: false, title: '角の形状', group: 'corner', name: 'attr'},
    _strokeMiterLimit : {type: 'checkbox', value: false, title: '角の比率', group: 'corner', name: 'attr'},
    _clipping         : {type: 'checkbox', value: false, title: 'クリッピングパス', group: 'path', name: 'attr'},
    _guides           : {type: 'checkbox', value: false, title: 'ガイドパス', group: 'path', name: 'attr'},
    _opacity          : {type: 'checkbox', value: false, title: '透明度', group: 'group1', name: 'attr'},
    // _strokeOverprint  : {type: 'checkbox', value: false, title: 'オーバープリント', group: 'group2', name: 'attr'},
    // _evenodd          : {type: 'checkbox', value: false, title: 'evenodd', group: 'group2', name: 'attr'},
  }},
  keepHandleData  : {type: 'checkbox', value: true, title: 'ハンドル情報を保持', helpTip: '連結点のハンドル情報を保持する\n※中間位置で連結しない時は2点の間にあるハンドルに対して'},
};
var controls = {};