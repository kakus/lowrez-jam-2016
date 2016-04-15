var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="Game.ts" />
/// <reference path="IState.ts" />
var core;
(function (core) {
    var Game = (function () {
        function Game(canvasId) {
            var _this = this;
            this.canvasId = canvasId;
            this.States = {};
            /** Whether paga has focus */
            this.HasFocus = true;
            /** Seconds since last frame. */
            this.TimeDelta = 0;
            this.LastFrameTime = 0;
            this.StateDOMListeners = [];
            this.Canvas = document.getElementById(canvasId);
            this.Context = this.Canvas.getContext('2d');
            this.RequestAnimationFrame = window.requestAnimationFrame.bind(window, this.OnUpdate.bind(this));
            window.onfocus = function () { return _this.HasFocus = true; };
            window.onblur = function () { return _this.HasFocus = false; };
        }
        Game.prototype.AddState = function (name, state) {
            this.States[name] = state;
        };
        Game.prototype.Play = function (stateName) {
            if (this.ActiveState) {
                this.CleanAfterState();
            }
            if (this.ActiveState = this.States[stateName]) {
                this.ActiveState.Game = this;
                this.ActiveState.Start();
            }
            else {
                throw new Error();
            }
        };
        Game.prototype.Start = function () {
            this.RequestAnimationFrame();
        };
        Game.prototype.AddDOMEventListener = function (element, type, listener) {
            this.StateDOMListeners.push({ element: element, type: type, listener: listener });
            element.addEventListener(type, listener);
            // console.log('Adding listener', element, type);
        };
        Game.prototype.RemoveDOMEventListener = function (element, type, listener) {
            for (var _i = 0, _a = this.StateDOMListeners; _i < _a.length; _i++) {
                var l = _a[_i];
                if (l.element === element && l.type === type && l.listener === listener) {
                    core.RemoveElement(this.StateDOMListeners, l);
                    element.removeEventListener(type, listener);
                    // console.log('Removing listener', element, type);
                    return;
                }
            }
            throw Error("Couldn't find event listener.");
        };
        Game.prototype.CleanAfterState = function () {
            for (var i = this.StateDOMListeners.length - 1; i >= 0; --i) {
                var l = this.StateDOMListeners[i];
                this.RemoveDOMEventListener(l.element, l.type, l.listener);
            }
            this.StateDOMListeners = [];
            if (this.ActiveState.Dispose) {
                this.ActiveState.Dispose();
            }
        };
        Game.prototype.OnUpdate = function (now) {
            var timeDelta = now - this.LastFrameTime;
            if (!this.HasFocus && timeDelta < 50) {
                return this.RequestAnimationFrame();
            }
            if (timeDelta > 50)
                timeDelta = 50;
            this.TimeDelta = timeDelta / 1000;
            this.ActiveState.Update(this.TimeDelta);
            this.ActiveState.Draw(this.Context);
            this.LastFrameTime = now;
            this.RequestAnimationFrame();
        };
        return Game;
    }());
    core.Game = Game;
})(core || (core = {}));
var core;
(function (core) {
    ;
    var Vector = (function () {
        function Vector(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vector.prototype.Set = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Vector.prototype.Clone = function (out) {
            if (out) {
                out.x = this.x;
                out.y = this.y;
                return out;
            }
            return new Vector(this.x, this.y);
        };
        Vector.prototype.toString = function () {
            return "[x: " + this.x + ", y: " + this.y + "]";
        };
        return Vector;
    }());
    core.Vector = Vector;
})(core || (core = {}));
var core;
(function (core) {
    var vector;
    (function (vector) {
        vector.Zero = new core.Vector();
        vector.Tmp = new core.Vector();
        function New(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            return new core.Vector(x, y);
        }
        vector.New = New;
        function Clone(a, o) {
            if (o) {
                o.x = a.x;
                o.y = a.y;
                return o;
            }
            else {
                return New(a.x, a.y);
            }
        }
        vector.Clone = Clone;
        function IsZero(a) {
            return a.x === 0 && a.y === 0;
        }
        vector.IsZero = IsZero;
        function Add(a, b, o) {
            o.x = a.x + b.x;
            o.y = a.y + b.y;
        }
        vector.Add = Add;
        function Subtract(a, b, o) {
            o.x = a.x - b.x;
            o.y = a.y - b.y;
        }
        vector.Subtract = Subtract;
        function Multiply(a, b, o) {
            o.x = a.x * b.x;
            o.y = a.y * b.y;
        }
        vector.Multiply = Multiply;
        function Scale(a, s, o) {
            if (o === void 0) { o = a; }
            o.x = a.x * s;
            o.y = a.y * s;
        }
        vector.Scale = Scale;
        function Length(a) {
            return Math.sqrt(a.x * a.x + a.y * a.y);
        }
        vector.Length = Length;
        function LengthSqr(a) {
            return a.x * a.x + a.y * a.y;
        }
        vector.LengthSqr = LengthSqr;
        function Unit(a, o) {
            if (o === void 0) { o = a; }
            var len = Length(a);
            if (len > 0) {
                o.x = a.x / len;
                o.y = a.y / len;
            }
        }
        vector.Unit = Unit;
        function Rotate(a, angle, o) {
            if (o === void 0) { o = a; }
            var sin = Math.sin(angle), cos = Math.cos(angle);
            if (a === o)
                a = Clone(a);
            o.x = a.x * cos - a.y * sin;
            o.y = a.x * sin + a.y * cos;
        }
        vector.Rotate = Rotate;
        function Angle(a) {
            return Math.atan2(a.y, a.x);
        }
        vector.Angle = Angle;
        function Invert(a, o) {
            o.x = a.x > 0 ? 1 / a.x : 0;
            o.y = a.y > 0 ? 1 / a.y : 0;
        }
        vector.Invert = Invert;
        function Dot(a, b) {
            return a.x * b.x + a.y * b.y;
        }
        vector.Dot = Dot;
        function Min(a, b, o) {
            o.x = Math.min(a.x, b.x);
            o.y = Math.min(a.y, b.y);
        }
        vector.Min = Min;
        function Max(a, b, o) {
            o.x = Math.max(a.x, b.x);
            o.y = Math.max(a.y, b.y);
        }
        vector.Max = Max;
    })(vector = core.vector || (core.vector = {}));
})(core || (core = {}));
// global shortcut to vector;
var vec = core.vector;
/// <reference path="Vector2.ts" />
var core;
(function (core) {
    var DisplayObject = (function () {
        function DisplayObject(x, y, width, height) {
            this.Position = core.vector.New(x, y);
            this.Size = core.vector.New(width, height);
            this.Anchor = core.vector.New(0, 0);
            this.Scale = core.vector.New(1, 1);
            this.Rotation = 0;
            this.Alpha = 1;
            this.Visible = true;
        }
        DisplayObject.prototype.Draw = function (ctx) {
            if (!this.Visible)
                return;
            ctx.save();
            ctx.globalAlpha *= this.Alpha;
            ctx.translate(this.Position.x, this.Position.y);
            ctx.scale(this.Scale.x, this.Scale.y);
            ctx.rotate(this.Rotation);
            if (!core.vector.IsZero(this.Anchor)) {
                ctx.translate(-this.Anchor.x * this.Size.x, -this.Anchor.y * this.Size.y);
            }
            this.CachedObject ? this.DrawCache(ctx) : this.DrawSelf(ctx);
            ctx.restore();
        };
        DisplayObject.prototype.DrawCache = function (ctx) {
            ctx.drawImage(this.CachedObject, 0, 0, this.Size.x, this.Size.y);
        };
        DisplayObject.prototype.ToLocal = function (point, out) {
            var local, tmp = core.vector.Tmp;
            if (out) {
                core.vector.Clone(point, out);
                local = out;
            }
            else {
                local = core.vector.Clone(point);
            }
            if (this.Parent) {
                this.Parent.ToLocal(point, local);
            }
            // Translation
            core.vector.Subtract(local, this.Position, local);
            // Scale
            core.vector.Clone(this.Scale, tmp);
            core.vector.Invert(tmp, tmp);
            core.vector.Multiply(local, tmp, local);
            // Rotation
            core.vector.Rotate(local, -this.Rotation, local);
            // Anchor Translation
            core.vector.Clone(this.Anchor, tmp);
            core.vector.Multiply(tmp, this.Size, tmp);
            core.vector.Add(local, tmp, local);
            if (!out)
                return local;
        };
        DisplayObject.prototype.ToGlobal = function (point, out) {
            var global = out ? out : core.vector.New(), tmp = core.vector.Tmp;
            // Anchor
            core.vector.Clone(this.Anchor, tmp);
            core.vector.Multiply(tmp, this.Size, tmp);
            core.vector.Subtract(point, tmp, global);
            // Rotation
            core.vector.Rotate(global, this.Rotation);
            // Scale
            core.vector.Multiply(global, this.Scale, global);
            // Translate
            core.vector.Add(global, this.Position, global);
            if (this.Parent) {
                this.Parent.ToGlobal(global, global);
            }
            if (!out)
                return global;
        };
        DisplayObject.prototype.IsPointInside = function (point, globalPoint, extents) {
            if (globalPoint === void 0) { globalPoint = true; }
            if (extents === void 0) { extents = core.vector.Zero; }
            var p = globalPoint ? this.ToLocal(point) : core.vector.Clone(point);
            var xAxis = p.x > -extents.x && p.x < this.Size.x + extents.x;
            var yAxis = p.y > -extents.y && p.y < this.Size.y + extents.y;
            return xAxis && yAxis;
        };
        /**
         * Check if this object is visible and also his parent and so on ...
         */
        DisplayObject.prototype.IsVisible = function () {
            if (this.Parent) {
                return this.Visible && this.Parent.IsVisible();
            }
            return this.Visible;
        };
        DisplayObject.prototype.RemoveFromParent = function () {
            this.Parent.RemoveChild(this);
        };
        /**
         * @param setup callback used to setup canvas context before drawing this object
         * @param scale if you want to cache sprite in higher resolution increase the scale
         * @param key if you want to store this object in global cache please provide a key,
         * 		  if key exist in global cache this sprite will be using stored cache instead
         * 		  of creating new one.
         */
        DisplayObject.prototype.Cache = function (scale, key, setup) {
            if (scale === void 0) { scale = 1; }
            var cache;
            if (key && (cache = DisplayObject.GlobalCache[key])) {
                this.CachedObject = cache;
                return;
            }
            cache = this.CachedObject = document.createElement('canvas');
            cache.width = this.Size.x * scale;
            cache.height = this.Size.y * scale;
            if (key)
                DisplayObject.GlobalCache[key] = cache;
            var ctx = cache.getContext('2d');
            ctx.scale(scale, scale);
            if (setup)
                setup(ctx);
            this.DrawSelf(ctx);
        };
        DisplayObject.GlobalCache = {};
        return DisplayObject;
    }());
    core.DisplayObject = DisplayObject;
    var Layer = (function (_super) {
        __extends(Layer, _super);
        function Layer(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            _super.call(this, x, y, width, height);
            this.Children = [];
        }
        Layer.prototype.AddChild = function () {
            var childs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                childs[_i - 0] = arguments[_i];
            }
            for (var _a = 0, childs_1 = childs; _a < childs_1.length; _a++) {
                var child = childs_1[_a];
                if (child.Parent) {
                    throw Error("Child has parent");
                }
                else {
                    child.Parent = this;
                    this.Children.push(child);
                }
            }
        };
        Layer.prototype.RemoveChild = function (child) {
            var index = this.Children.indexOf(child);
            if (index >= 0) {
                child.Parent = undefined;
                this.Children.splice(index, 1);
            }
            else {
                throw Error("Child doesn't exist in this layer");
            }
        };
        Layer.prototype.DrawSelf = function (ctx) {
            for (var _i = 0, _a = this.Children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.Draw(ctx);
            }
        };
        return Layer;
    }(DisplayObject));
    core.Layer = Layer;
})(core || (core = {}));
/// <reference path="DisplayObject.ts" />
var core;
(function (core) {
    function TranslateMouseEvent(receiver, ctx, event) {
        var x = event.pageX, y = event.pageY;
        var rect = event.target.getBoundingClientRect();
        var point = new core.Vector(x - rect.left, y - rect.top);
        receiver.call(ctx, point, event);
    }
    /** TODO: Remove this workaround */
    var LAST_TOUCH_POS = new core.Vector();
    function TranslateTouchEvent(receiver, ctx, event) {
        var x = 0, y = 0;
        if (event.type !== 'touchend') {
            x = event.targetTouches[0].pageX,
                y = event.targetTouches[0].pageY;
            var rect = event.target.getBoundingClientRect();
            LAST_TOUCH_POS.Set(x - rect.left, y - rect.top);
        }
        receiver.call(ctx, LAST_TOUCH_POS.Clone(), event);
        event.preventDefault();
    }
    function MakeMouseEventTranslator(receiver, ctx) {
        return TranslateMouseEvent.bind(null, receiver, ctx);
    }
    core.MakeMouseEventTranslator = MakeMouseEventTranslator;
    function MakeTouchEventTranslator(receiver, ctx) {
        return TranslateTouchEvent.bind(null, receiver, ctx);
    }
    core.MakeTouchEventTranslator = MakeTouchEventTranslator;
    var GenericInputController = (function () {
        function GenericInputController() {
            this.OnDownListeners = [];
            this.OnUpListeners = [];
        }
        GenericInputController.prototype.WhenPointerDown = function (object, action) {
            this.OnDownListeners.push({ object: object, action: action });
            return this;
        };
        GenericInputController.prototype.WhenPointerUp = function (object, action) {
            this.OnUpListeners.push({ object: object, action: action });
            return this;
        };
        GenericInputController.prototype.WhenPointerClick = function (object, action, ctx) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            var timeOfDownEvent = 0;
            this.OnDownListeners.push({ object: object, action: function () { return timeOfDownEvent = Date.now(); } });
            this.OnUpListeners.push({ object: object, action: function () {
                    if (Date.now() - timeOfDownEvent < 450) {
                        action.apply(ctx, args);
                    }
                } });
            return this;
        };
        GenericInputController.prototype.OnPointerDown = function (point) {
            this.HandleEvent(this.OnDownListeners, point);
        };
        GenericInputController.prototype.OnPointerMove = function (point) {
        };
        GenericInputController.prototype.OnPointerUp = function (point) {
            this.HandleEvent(this.OnUpListeners, point);
        };
        GenericInputController.prototype.HandleEvent = function (listeners, point) {
            for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
                var _a = listeners_1[_i], object = _a.object, action = _a.action;
                if (object.IsVisible() && object.IsPointInside(point)) {
                    action();
                }
            }
        };
        GenericInputController.prototype.Update = function () { };
        return GenericInputController;
    }());
    core.GenericInputController = GenericInputController;
})(core || (core = {}));
var core;
(function (core) {
    function RemoveElement(array, element) {
        var i = array.indexOf(element);
        if (i >= 0) {
            return array.splice(i, 1);
        }
        else
            throw new Error();
    }
    core.RemoveElement = RemoveElement;
    /**
     * If element doesn't exist in collection, nothing happens.
     */
    function TryRemoveElement(array, element) {
        var i = array.indexOf(element);
        if (i >= 0) {
            return array.splice(i, 1);
        }
    }
    core.TryRemoveElement = TryRemoveElement;
    function Last(array) {
        return array[array.length - 1];
    }
    core.Last = Last;
    function Clone(array) {
        return array.slice(0);
    }
    core.Clone = Clone;
    /**
     * @return new array, with elements shuffled.
     */
    function ShuffleArray(array) {
        array = Clone(array);
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    core.ShuffleArray = ShuffleArray;
    // export function Brightness(base: string, brightess: number): string
    // {
    // 	let rgb = base.substr(1).match(/.{2}/g).map((v) => parseInt(v, 16));
    // 	rgb = rgb.map((v) => Math.min(v * brightess, 255)|0);
    // 	let hex = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
    // 	return '#' + (hex + 0x1000000).toString(16).substr(1);
    // }
    function IsPointInside(point, obj) {
        var pos = core.vector.Tmp;
        core.vector.Clone(obj.Anchor, pos);
        core.vector.Multiply(pos, obj.Size, pos);
        core.vector.Subtract(obj.Position, pos, pos);
        return point.x > pos.x &&
            point.x < pos.x + obj.Size.x &&
            point.y > pos.y &&
            point.y < obj.Size.y + pos.y;
    }
    core.IsPointInside = IsPointInside;
    var FPSMeter = (function () {
        function FPSMeter(ProbeNum) {
            if (ProbeNum === void 0) { ProbeNum = 60; }
            this.ProbeNum = ProbeNum;
            this.ProbeIdx = 0;
            this.Probes = new Array(ProbeNum);
            for (var i = 0; i < ProbeNum; ++i)
                this.Probes[i] = 0;
        }
        FPSMeter.prototype.Update = function (timeDelta) {
            this.Probes[(this.ProbeIdx++) % this.ProbeNum] = timeDelta;
        };
        FPSMeter.prototype.GetFPS = function () {
            return 1 / this.GetAvgFrameTime();
        };
        FPSMeter.prototype.GetAvgFrameTime = function () {
            var avg = 0;
            for (var i = 0; i < this.ProbeNum; ++i)
                avg += this.Probes[i];
            return avg / this.ProbeNum;
        };
        return FPSMeter;
    }());
    core.FPSMeter = FPSMeter;
    var CallbackSet = (function () {
        function CallbackSet() {
            this.Callbacks = [];
        }
        CallbackSet.prototype.Add = function (callback, ctx) {
            this.Callbacks.push([callback, ctx, false]);
            return this;
        };
        CallbackSet.prototype.AddOnce = function (callback, ctx) {
            this.Callbacks.push([callback, ctx, true]);
            return this;
        };
        CallbackSet.prototype.CallAll = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            for (var i = this.Callbacks.length - 1; i >= 0; --i) {
                var _a = this.Callbacks[i], callback = _a[0], ctx = _a[1], remove = _a[2];
                callback.apply(ctx, args);
                if (remove) {
                    this.Callbacks.splice(i, 1);
                }
            }
        };
        return CallbackSet;
    }());
    core.CallbackSet = CallbackSet;
})(core || (core = {}));
/// <reference path="Utils.ts" />
var core;
(function (core) {
    var Tween = (function () {
        function Tween(Target, Manager) {
            this.Target = Target;
            this.Manager = Manager;
            this.ElapsedTime = 0;
            this.TweenedProperties = [];
            this.Duration = 0;
            this.OnDoneCallbacks = new core.CallbackSet();
            this.OnStart = new core.CallbackSet();
            this.OnUpdateCallbacks = new core.CallbackSet();
            this.IsDone = false;
            this.PlayReversed = false;
        }
        /**
         * Starts tween. Remeber that this will reset whole tween chain, and
         * start playing from beggining of this chain.
         */
        Tween.prototype.Start = function () {
            var root = this.GetRoot();
            if (root.Manager) {
                if (root.IsPlaying()) {
                    root.Manager.StopTween(root);
                }
                root.Manager.StartTween(root);
            }
            while (root) {
                root.IsDone = false;
                root.ElapsedTime = 0;
                root = root.Next;
            }
            return this;
        };
        Tween.prototype.Stop = function (finish) {
            if (finish === void 0) { finish = true; }
            var root = this.GetRoot();
            if (root.Manager && root.IsPlaying()) {
                if (finish) {
                    root.Update(1e10);
                }
                else {
                    root.Manager.StopTween(root);
                }
            }
        };
        Tween.prototype.To = function (properites, duration, ease) {
            if (duration === void 0) { duration = 1; }
            if (ease === void 0) { ease = easing.Linear; }
            core.Assert(duration > 0, "Duration has be greater than 0.");
            this.TweenedProperties = [];
            for (var key_1 in properites) {
                this.TweenedProperties.push({
                    key: key_1,
                    start: 0,
                    change: 0,
                    end: properites[key_1]
                });
            }
            this.Duration = duration;
            this.Easeing = ease;
            return this;
        };
        Tween.prototype.WhenDone = function (callback) {
            this.OnDoneCallbacks.Add(callback);
            return this;
        };
        Tween.prototype.OnUpdate = function (callback) {
            this.OnUpdateCallbacks.Add(callback);
            return this;
        };
        /**
         * Returned tween will be executed in sequnce
         * @return new tween
         */
        Tween.prototype.Then = function (target) {
            if (target === void 0) { target = this.Target; }
            var tween = new Tween(target, this.Manager);
            this.Next = tween;
            tween.Prev = this;
            return tween;
        };
        /**
         * Run new tween in parallel.
         *
         * @return this tween
         */
        Tween.prototype.Parallel = function (target, callback) {
            this.OnStart.Add(function () {
                if (this.Manager) {
                    callback(this.Manager.New(target).Start());
                }
                else {
                    throw Error();
                }
            }, this);
            return this;
        };
        /**
         * @return new tween
         */
        Tween.prototype.Delay = function (duration) {
            return this.To({}, duration);
        };
        Tween.prototype.Reverse = function () {
            for (var tween = this; tween; tween = tween.Prev) {
                tween.PlayReversed = !tween.PlayReversed;
            }
            return this;
        };
        Tween.prototype.Loop = function () {
            var _this = this;
            this.OnStart.Add(function () {
                setTimeout(_this.Start.bind(_this), 0);
            });
            return this;
        };
        Tween.prototype.Update = function (timeDelta) {
            var self = this;
            while (self) {
                if (self.ElapsedTime === 0)
                    self.InitProperties();
                self.ElapsedTime += timeDelta;
                if (self.ElapsedTime <= self.Duration) {
                    self.UpdateProperties(self.ElapsedTime);
                    return;
                }
                else {
                    if (!self.IsDone) {
                        self.UpdateProperties(self.Duration);
                        self.OnDoneCallbacks.CallAll(self.Target);
                        if (self.Manager && !self.Next)
                            self.Manager.StopTween(self.GetRoot());
                        self.IsDone = true;
                    }
                    self = self.Next;
                }
            }
        };
        Tween.prototype.GetRoot = function () {
            var root = this;
            while (root.Prev) {
                root = root.Prev;
            }
            return root;
        };
        /**
         * Check wether this tween (whole tween chain) has finishied playing.
         */
        Tween.prototype.IsPlaying = function () {
            if (this.Manager) {
                return this.Manager.Tweens.indexOf(this.GetRoot()) >= 0;
            }
            else
                throw Error();
        };
        Tween.prototype.UpdateProperties = function (elapsedTime) {
            for (var _i = 0, _a = this.TweenedProperties; _i < _a.length; _i++) {
                var property = _a[_i];
                this.Target[property.key] = this.Easeing(elapsedTime, property.start, property.change, this.Duration);
            }
            this.OnUpdateCallbacks.CallAll(this.Target, elapsedTime / this.Duration);
        };
        Tween.prototype.InitProperties = function () {
            for (var _i = 0, _a = this.TweenedProperties; _i < _a.length; _i++) {
                var property = _a[_i];
                if (this.PlayReversed) {
                    var start = property.start || this.Target[property.key];
                    property.start = property.end;
                    property.end = start;
                }
                else {
                    property.start = this.Target[property.key];
                }
                property.change = property.end - property.start;
            }
            this.OnStart.CallAll();
        };
        return Tween;
    }());
    core.Tween = Tween;
    var easing;
    (function (easing) {
        function Linear(t, b, c, d) {
            return c * t / d + b;
        }
        easing.Linear = Linear;
        /** Slows at the end of tween */
        function CubicOut(t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t + 1) + b;
        }
        easing.CubicOut = CubicOut;
        /** Increases speed at the end of tween */
        function CubicIn(t, b, c, d) {
            t /= d;
            return c * t * t * t + b;
        }
        easing.CubicIn = CubicIn;
        ;
        function SinusoidalInOut(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
        easing.SinusoidalInOut = SinusoidalInOut;
    })(easing = core.easing || (core.easing = {}));
    var TweenManager = (function () {
        function TweenManager() {
            this.Tweens = [];
        }
        TweenManager.prototype.New = function (target) {
            var tween = new core.Tween(target, this);
            return tween;
        };
        TweenManager.prototype.StartTween = function (tween) {
            this.Tweens.push(tween);
        };
        TweenManager.prototype.StopTween = function (tween) {
            core.RemoveElement(this.Tweens, tween);
        };
        TweenManager.prototype.TweenPlaying = function () {
            return this.Tweens.some(function (tw) { return tw.IsPlaying(); });
        };
        TweenManager.prototype.Update = function (timeDelta) {
            for (var _i = 0, _a = this.Tweens; _i < _a.length; _i++) {
                var tween = _a[_i];
                tween.Update(timeDelta);
            }
        };
        TweenManager.prototype.StopAll = function (finishTween) {
            if (finishTween === void 0) { finishTween = true; }
            for (var i = this.Tweens.length - 1; i >= 0; --i) {
                this.Tweens[i].Stop(finishTween);
            }
        };
        return TweenManager;
    }());
    core.TweenManager = TweenManager;
})(core || (core = {}));
/// <reference path="Utils.ts" />
var core;
(function (core) {
    var Timer = (function () {
        function Timer(Callback, Ctx, Delay, Interval, 
            /** How many times this callback can be called, 0 means -> infinite */
            CallLimit, Args) {
            if (Interval === void 0) { Interval = 0; }
            if (CallLimit === void 0) { CallLimit = 1; }
            this.Callback = Callback;
            this.Ctx = Ctx;
            this.Delay = Delay;
            this.Interval = Interval;
            this.CallLimit = CallLimit;
            this.Args = Args;
            this.ElapsedTime = 0;
            this.CallCount = 0;
        }
        /**
         * @return whether this timer is done.
         */
        Timer.prototype.Update = function (timeDelta) {
            this.ElapsedTime += timeDelta;
            if (this.ElapsedTime > this.Delay) {
                if (this.CallLimit > 0 && this.CallCount > this.CallLimit - 1) {
                    return true;
                }
                if (this.ElapsedTime - this.Delay > this.Interval * this.CallCount) {
                    this.CallCount += 1;
                    this.Callback.apply(this.Ctx, [this.CallCount].concat(this.Args));
                }
            }
            return false;
        };
        Timer.prototype.Stop = function () {
            if (this.Manager) {
                this.Manager.Remove(this);
            }
            else
                throw Error("This timer doesn't have manager.");
        };
        return Timer;
    }());
    core.Timer = Timer;
    var TimersManager = (function () {
        function TimersManager() {
            this.Timers = [];
            this.ThrottledCallback = [];
        }
        TimersManager.prototype.Delay = function (delay, callback, ctx) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            var timer = new Timer(callback, ctx, delay, undefined, 1, args);
            timer.Manager = this;
            this.Timers.push(timer);
            return timer;
        };
        TimersManager.prototype.Repeat = function (interval, callback, ctx, callLimit, delay) {
            if (callLimit === void 0) { callLimit = 0; }
            if (delay === void 0) { delay = 0; }
            var args = [];
            for (var _i = 5; _i < arguments.length; _i++) {
                args[_i - 5] = arguments[_i];
            }
            var timer = new Timer(callback, ctx, delay, interval, callLimit, args);
            timer.Manager = this;
            this.Timers.push(timer);
            return timer;
        };
        TimersManager.prototype.Throttle = function (min, callback, ctx) {
            var _this = this;
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            var i = this.ThrottledCallback.indexOf(callback);
            if (i < 0) {
                callback.apply(ctx, args);
                this.ThrottledCallback.push(callback);
                this.Delay(min, function () { return core.RemoveElement(_this.ThrottledCallback, callback); });
            }
        };
        TimersManager.prototype.Update = function (timeDelta) {
            for (var i = this.Timers.length - 1; i >= 0; --i) {
                var isDone = this.Timers[i].Update(timeDelta);
                if (isDone) {
                    this.Timers.splice(i, 1);
                }
            }
        };
        TimersManager.prototype.Count = function () {
            return this.Timers.length;
        };
        /**
         * TODO: Protect if this method is called from timer. Could remove collection while iterating
         * over it.
         */
        TimersManager.prototype.RemoveAll = function () {
            for (var _i = 0, _a = this.Timers; _i < _a.length; _i++) {
                var timer = _a[_i];
                timer.Manager = undefined;
            }
            this.Timers = [];
        };
        TimersManager.prototype.Remove = function (timer) {
            core.RemoveElement(this.Timers, timer);
            timer.Manager = undefined;
        };
        return TimersManager;
    }());
    core.TimersManager = TimersManager;
})(core || (core = {}));
var core;
(function (core) {
    var math;
    (function (math) {
        var vec = core.vector;
        function Clamp(value, min, max) {
            return Math.max(Math.min(value, max), min);
        }
        math.Clamp = Clamp;
        function DistanceP2L(point, a, b) {
            var dir = vec.New(), a2p = vec.New();
            vec.Subtract(b, a, dir);
            vec.Subtract(point, a, a2p);
            var p = vec.Dot(a2p, dir) / vec.LengthSqr(dir);
            vec.Scale(dir, p);
            vec.Add(dir, a, dir);
            vec.Subtract(point, dir, dir);
            return vec.Length(dir);
        }
        math.DistanceP2L = DistanceP2L;
    })(math = core.math || (core.math = {}));
})(core || (core = {}));
/// <reference path="../core/IState.ts" />
/// <reference path="../core/Game.ts" />
/// <reference path="../core/InputController.ts" />
/// <reference path="../core/Tween.ts" />
/// <reference path="../core/Timer.ts" />
/// <reference path="../core/Math.ts" />
/// <reference path="../core/Keyboard.ts" />
var state;
(function (state) {
    var AbstractState = (function () {
        function AbstractState() {
            this.DefaultSize = new core.Vector(320, 400);
        }
        AbstractState.prototype.Start = function () {
            var _this = this;
            this.Stage = new core.Layer(0, 0, this.DefaultSize.x, this.DefaultSize.y);
            this.Tweens = new core.TweenManager();
            this.Timers = new core.TimersManager();
            this.FPSMeter = new core.FPSMeter(60);
            this.FPSText = new gfx.AAText(10, 10, 'FPS');
            this.FPSText.SetSize(10);
            this.FPSText.Visible = false;
            this.Game.AddDOMEventListener(window, 'resize', function (e) { return _this.OnResize(); });
        };
        AbstractState.prototype.Update = function (timeDelta) {
            this.Timers.Update(timeDelta);
            this.Tweens.Update(timeDelta);
            if (this.FPSText.Visible) {
                this.FPSMeter.Update(timeDelta);
                this.FPSText.SetText(this.FPSMeter.GetFPS().toFixed(1));
            }
        };
        AbstractState.prototype.Draw = function (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            this.Stage.Draw(ctx);
            this.FPSText.Draw(ctx);
        };
        AbstractState.prototype.OnPointerDown = function (point) {
            this.InputController.OnPointerDown(point);
        };
        AbstractState.prototype.OnPointerMove = function (point) {
            this.InputController.OnPointerMove(point);
        };
        AbstractState.prototype.OnPointerUp = function (point) {
            this.InputController.OnPointerUp(point);
        };
        AbstractState.prototype.OnKeyDown = function (key) {
            console.log('keydown ', key);
        };
        AbstractState.prototype.OnKeyUp = function (key) {
            console.log('keyup ', key);
        };
        AbstractState.prototype.OnResize = function () {
            var width = window.innerWidth, height = window.innerHeight;
            // this.DefaultSize.x = core.math.Clamp(width, 320, 480);
            var scale = Math.min(width / this.DefaultSize.x, height / this.DefaultSize.y);
            this.Stage.Scale.Set(scale, scale);
            this.Stage.Size.Set(this.DefaultSize.x, this.DefaultSize.y);
            // let scale = 1;
            // this.Stage.Size.Set(this.DefaultSize.x, this.DefaultSize.y);
            var canvasWidth = Math.floor(this.Stage.Size.x * scale);
            if (this.Game.Canvas.width !== canvasWidth) {
                this.Game.Canvas.width = canvasWidth;
            }
            var canvasHeight = Math.floor(this.Stage.Size.y * scale);
            if (this.Game.Canvas.height !== canvasHeight) {
                this.Game.Canvas.height = canvasHeight;
            }
            this.Game.Context['imageSmoothingEnabled'] = false;
            this.Game.Context['mozImageSmoothingEnabled'] = false;
            this.Game.Context['webkitImageSmoothingEnabled'] = false;
            this.Game.Context['msImageSmoothingEnabled'] = false;
        };
        AbstractState.prototype.ShowFps = function () {
            this.FPSText.Visible = true;
        };
        AbstractState.prototype.DimScreen = function (reverse, time) {
            if (reverse === void 0) { reverse = false; }
            if (time === void 0) { time = 2; }
            if (reverse) {
                this.Stage.Alpha = 1 - this.Stage.Alpha;
            }
            return this.Tweens.New(this.Stage)
                .To({ Alpha: reverse ? 1 : 0 }, time)
                .Start();
        };
        AbstractState.prototype.ShakeScreen = function (time, amplitude) {
            if (amplitude === void 0) { amplitude = 5; }
            return this.Tweens.New(this.Stage.Position)
                .OnUpdate(function (position, progress) {
                progress = Math.sin(progress * Math.PI);
                position.Set((core.Random(-amplitude, amplitude) * progress) | 0, (core.Random(-amplitude, amplitude) * progress) | 0);
            })
                .Delay(time)
                .Then()
                .To({ x: 0, y: 0 }, 0.01)
                .Start();
        };
        AbstractState.prototype.ListenForMouseInput = function () {
            if (!this.InputController)
                throw Error();
            this.Game.AddDOMEventListener(this.Game.Canvas, 'mousemove', core.MakeMouseEventTranslator(this.OnPointerMove, this));
            this.Game.AddDOMEventListener(this.Game.Canvas, 'mousedown', core.MakeMouseEventTranslator(this.OnPointerDown, this));
            this.Game.AddDOMEventListener(this.Game.Canvas, 'mouseup', core.MakeMouseEventTranslator(this.OnPointerUp, this));
        };
        AbstractState.prototype.ListenForTouchInput = function () {
            if (!this.InputController)
                throw Error();
            this.Game.AddDOMEventListener(this.Game.Canvas, 'touchmove', core.MakeTouchEventTranslator(this.OnPointerMove, this));
            this.Game.AddDOMEventListener(this.Game.Canvas, 'touchstart', core.MakeTouchEventTranslator(this.OnPointerDown, this));
            this.Game.AddDOMEventListener(this.Game.Canvas, 'touchend', core.MakeTouchEventTranslator(this.OnPointerUp, this));
        };
        AbstractState.prototype.ListenForKeyboard = function () {
            var _this = this;
            if (!this.InputController)
                throw Error();
            this.Game.AddDOMEventListener(window, 'keydown', function (e) {
                _this.OnKeyDown(e.keyCode);
                e.preventDefault();
            });
            this.Game.AddDOMEventListener(window, 'keyup', function (e) {
                _this.OnKeyUp(e.keyCode);
                e.preventDefault();
            });
        };
        return AbstractState;
    }());
    state.AbstractState = AbstractState;
})(state || (state = {}));
/// <reference path="IFont.ts" />
var gfx;
(function (gfx) {
    var FontChache = (function () {
        function FontChache(Font, Size, Color) {
            if (Color === void 0) { Color = 'white'; }
            this.Font = Font;
            this.Size = Size;
            this.Color = Color;
            this.CacheMap = {};
            this.DotSizePx = Size / Font.Char.Height;
            this.CharWidthPx = Font.Char.Width * this.DotSizePx;
            this.Cache = document.createElement('canvas');
            this.Cache.width = Object.keys(Font.Letter).length * Math.ceil(this.CharWidthPx + this.DotSizePx);
            this.Cache.height = Size;
            console.log('FontCache Size', this.Size, 'DotPx', this.DotSizePx, 'Color', this.Color);
            this.Render();
        }
        FontChache.prototype.DrawLetter = function (ctx, letter, x, y, scaleX, scaleY) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (scaleX === void 0) { scaleX = 1; }
            if (scaleY === void 0) { scaleY = scaleX; }
            ctx.drawImage(this.Cache, this.CacheMap[letter], 0, this.CharWidthPx, this.Size, x, y, this.CharWidthPx * scaleX, this.Size * scaleY);
        };
        FontChache.prototype.Render = function () {
            var ctx = this.Cache.getContext('2d');
            var offsetX = 0;
            ctx.fillStyle = this.Color;
            for (var letter in this.Font.Letter) {
                this.RenderLetter(ctx, letter);
                this.CacheMap[letter] = offsetX;
                var dx = Math.ceil(this.CharWidthPx + this.DotSizePx);
                // let dx = this.CharWidthPx;
                offsetX += dx;
                ctx.translate(dx, 0);
            }
        };
        FontChache.prototype.RenderLetter = function (ctx, letter) {
            var font = this.Font, dpx = this.DotSizePx;
            for (var x = 0; x < font.Char.Width; ++x) {
                for (var y = 0; y < font.Char.Height; ++y) {
                    var dot = font.Letter[letter][y * font.Char.Width + x];
                    if (dot)
                        ctx.fillRect(x * dpx, y * dpx, dpx, dpx);
                }
            }
        };
        return FontChache;
    }());
    gfx.FontChache = FontChache;
})(gfx || (gfx = {}));
/// <reference path="IFont.ts" />
/// <reference path="FontCache.ts" />
var gfx;
(function (gfx) {
    gfx.PixelFont = {
        Char: {
            Width: 3,
            Height: 5
        },
        Letter: {
            '+': [
                0, 0, 0,
                0, 1, 0,
                1, 1, 1,
                0, 1, 0,
                0, 0, 0
            ],
            '-': [
                0, 0, 0,
                0, 0, 0,
                1, 1, 1,
                0, 0, 0,
                0, 0, 0
            ],
            '_': [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0,
                0, 0, 0,
                1, 1, 1
            ],
            '.': [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0,
                0, 0, 0,
                0, 1, 0
            ],
            ',': [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0,
                0, 1, 0,
                1, 0, 0
            ],
            ':': [
                0, 0, 0,
                0, 1, 0,
                0, 0, 0,
                0, 1, 0,
                0, 0, 0
            ],
            '?': [
                1, 1, 0,
                0, 0, 1,
                0, 1, 1,
                0, 0, 0,
                0, 1, 0
            ],
            '!': [
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 0, 0,
                0, 1, 0
            ],
            '♥': [
                1, 0, 1,
                1, 1, 1,
                1, 1, 1,
                0, 1, 0,
                0, 0, 0
            ],
            '0': [
                1, 1, 1,
                1, 0, 1,
                1, 0, 1,
                1, 0, 1,
                1, 1, 1
            ],
            '1': [
                0, 1, 0,
                1, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0
            ],
            '2': [
                1, 1, 1,
                0, 0, 1,
                1, 1, 1,
                1, 0, 0,
                1, 1, 1
            ],
            '3': [
                1, 1, 1,
                0, 0, 1,
                0, 1, 1,
                0, 0, 1,
                1, 1, 1
            ],
            '4': [
                1, 0, 1,
                1, 0, 1,
                1, 1, 1,
                0, 0, 1,
                0, 0, 1
            ],
            '5': [
                1, 1, 1,
                1, 0, 0,
                1, 1, 1,
                0, 0, 1,
                1, 1, 0
            ],
            '6': [
                0, 1, 1,
                1, 0, 0,
                1, 1, 1,
                1, 0, 1,
                1, 1, 1
            ],
            '7': [
                1, 1, 1,
                0, 0, 1,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0
            ],
            '8': [
                1, 1, 1,
                1, 0, 1,
                1, 1, 1,
                1, 0, 1,
                1, 1, 1
            ],
            '9': [
                1, 1, 1,
                1, 0, 1,
                1, 1, 1,
                0, 0, 1,
                1, 1, 0
            ],
            'A': [
                0, 1, 0,
                1, 0, 1,
                1, 1, 1,
                1, 0, 1,
                1, 0, 1
            ],
            'B': [
                1, 1, 0,
                1, 0, 1,
                1, 1, 0,
                1, 0, 1,
                1, 1, 0
            ],
            'C': [
                1, 1, 1,
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 1, 1
            ],
            'D': [
                1, 1, 0,
                1, 0, 1,
                1, 0, 1,
                1, 0, 1,
                1, 1, 0
            ],
            'E': [
                1, 1, 1,
                1, 0, 0,
                1, 1, 0,
                1, 0, 0,
                1, 1, 1
            ],
            'F': [
                1, 1, 1,
                1, 0, 0,
                1, 1, 0,
                1, 0, 0,
                1, 0, 0
            ],
            'G': [
                1, 1, 1,
                1, 0, 0,
                1, 0, 1,
                1, 0, 1,
                1, 1, 1
            ],
            'H': [
                1, 0, 1,
                1, 0, 1,
                1, 1, 1,
                1, 0, 1,
                1, 0, 1
            ],
            'I': [
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0
            ],
            'J': [
                1, 1, 1,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                1, 0, 0
            ],
            'K': [
                1, 0, 1,
                1, 0, 1,
                1, 1, 0,
                1, 0, 1,
                1, 0, 1
            ],
            'L': [
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 1, 1
            ],
            'N': [
                0, 0, 1,
                1, 0, 1,
                1, 1, 1,
                1, 0, 1,
                1, 0, 0
            ],
            'M': [
                1, 0, 1,
                1, 1, 1,
                1, 0, 1,
                1, 0, 1,
                1, 0, 1
            ],
            'O': [
                1, 1, 1,
                1, 0, 1,
                1, 0, 1,
                1, 0, 1,
                1, 1, 1
            ],
            'P': [
                1, 1, 1,
                1, 0, 1,
                1, 1, 1,
                1, 0, 0,
                1, 0, 0
            ],
            'Q': [
                1, 1, 1,
                1, 0, 1,
                1, 0, 1,
                1, 1, 0,
                0, 0, 1
            ],
            'R': [
                1, 1, 0,
                1, 0, 1,
                1, 1, 0,
                1, 0, 1,
                1, 0, 1
            ],
            'S': [
                1, 1, 1,
                1, 0, 0,
                1, 1, 0,
                0, 0, 1,
                1, 1, 1
            ],
            'T': [
                1, 1, 1,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0
            ],
            'U': [
                1, 0, 1,
                1, 0, 1,
                1, 0, 1,
                1, 0, 1,
                1, 1, 1
            ],
            'W': [
                1, 0, 1,
                1, 0, 1,
                1, 0, 1,
                1, 1, 1,
                1, 0, 1
            ],
            'V': [
                1, 0, 1,
                1, 0, 1,
                1, 0, 1,
                1, 0, 1,
                0, 1, 0
            ],
            'X': [
                1, 0, 1,
                1, 0, 1,
                0, 1, 0,
                1, 0, 1,
                1, 0, 1
            ],
            'Y': [
                1, 0, 1,
                1, 0, 1,
                1, 0, 1,
                0, 1, 0,
                0, 1, 0
            ],
            'Z': [
                1, 1, 1,
                0, 0, 1,
                0, 1, 1,
                1, 0, 0,
                1, 1, 1
            ]
        },
        Cache: {}
    };
})(gfx || (gfx = {}));
/// <reference path="../core/DisplayObject.ts" />
/// <reference path="PixelFont.ts" />
var gfx;
(function (gfx) {
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(x, y, Text, Style) {
            if (Text === void 0) { Text = ""; }
            if (Style === void 0) { Style = { Size: 20, Color: 'white', Font: gfx.PixelFont }; }
            _super.call(this, x, y, 0, 0);
            this.Text = Text;
            this.Style = Style;
            this.SetColor(Style.Color);
            this.SetSize(Style.Size);
        }
        Text.prototype.SetColor = function (color) {
            if (this.Style.Font.Cache[color]) {
                this.FontRenderer = this.Style.Font.Cache[color];
            }
            else {
                this.FontRenderer = this.Style.Font.Cache[color] = new gfx.FontChache(this.Style.Font, 20, color);
            }
        };
        Text.prototype.SetText = function (text) {
            this.Text = text;
            this.UpdateSize();
        };
        Text.prototype.SetSize = function (size) {
            this.Style.Size = size;
            this.DotSizePx = size / this.Style.Font.Char.Height;
            this.CharWidthPx = this.Style.Font.Char.Width * this.DotSizePx;
            this.UpdateSize();
        };
        Text.prototype.DrawSelf = function (ctx) {
            var scale = this.Style.Size / this.FontRenderer.Size;
            for (var i = 0; i < this.Text.length; ++i) {
                var letter = this.Text[i];
                if (letter !== ' ') {
                    this.FontRenderer.DrawLetter(ctx, letter, 0, 0, scale);
                }
                ctx.translate(this.CharWidthPx + this.DotSizePx, 0);
            }
        };
        Text.prototype.UpdateSize = function () {
            this.Size.x = (this.CharWidthPx + this.DotSizePx) * this.Text.length - this.DotSizePx;
            this.Size.y = this.Style.Size;
        };
        return Text;
    }(core.DisplayObject));
    gfx.Text = Text;
    /**
     * Axis aligned text.
     *
     * Text which is optimized for drawing without rotation.
     */
    var AAText = (function (_super) {
        __extends(AAText, _super);
        function AAText() {
            _super.apply(this, arguments);
        }
        AAText.prototype.Draw = function (ctx) {
            if (!this.Visible)
                return;
            var scale = this.Style.Size / this.FontRenderer.Size, _a = this.Position, x = _a.x, y = _a.y;
            x -= this.Size.x * this.Anchor.x * this.Scale.x;
            y -= this.Size.y * this.Anchor.y * this.Scale.y;
            var alphaSave = ctx.globalAlpha;
            ctx.globalAlpha *= this.Alpha;
            // ctx.strokeStyle = 'white';
            // ctx.strokeRect(x, y, this.Size.x * this.Scale.y, this.Size.y * this.Scale.y);
            for (var i = 0; i < this.Text.length; ++i) {
                var letter = this.Text[i];
                if (letter !== ' ') {
                    this.FontRenderer.DrawLetter(ctx, letter, x, y, scale * this.Scale.x, scale * this.Scale.y);
                }
                x += (this.CharWidthPx + this.DotSizePx) * this.Scale.x;
            }
            ctx.globalAlpha = alphaSave;
        };
        AAText.prototype.Cache = function () {
            throw Error('Use gfx.Text if you want cache');
        };
        return AAText;
    }(Text));
    gfx.AAText = AAText;
})(gfx || (gfx = {}));
/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../core/Tween.ts" />
var state;
(function (state) {
    var SplashScreen = (function (_super) {
        __extends(SplashScreen, _super);
        function SplashScreen() {
            _super.apply(this, arguments);
        }
        SplashScreen.prototype.Start = function () {
            var _this = this;
            _super.prototype.Start.call(this);
            this.Game.Canvas.style.background = 'black';
            this.Title = new core.Layer();
            this.Title.Scale.Set(0.5, 0.5);
            var line1 = new gfx.AAText(0, 0, "A GAME BY KAKUS");
            line1.Anchor.Set(0.5, 0.5);
            var line2 = new core.Layer(0, line1.Size.y + 10);
            var made = new gfx.AAText(0, 0, "MADE WITH ");
            var heart = new gfx.AAText(made.Size.x, 0, "♥");
            heart.SetColor('red');
            var js13k = new gfx.AAText(heart.Position.x + heart.Size.x, 0, " FOR TADZIK");
            line2.Anchor.Set(0.5, 0.5);
            line2.Size.Set(js13k.Position.x + js13k.Size.x, js13k.Size.y);
            line2.AddChild(made, heart, js13k);
            var year = new gfx.AAText(0, line2.Position.y + 300, "2016");
            year.Anchor.Set(0.5, 0.5);
            this.Title.AddChild(line1);
            this.Title.AddChild(line2);
            this.Title.AddChild(year);
            this.Stage.Alpha = 0;
            this.Tweens.New(this.Stage)
                .To({ Alpha: 1 })
                .Then()
                .Delay(1)
                .Then()
                .To({ Alpha: 0 })
                .WhenDone(function () { return _this.Game.Play('menu'); })
                .Start();
            this.Stage.AddChild(this.Title);
            this.OnResize();
        };
        SplashScreen.prototype.OnResize = function () {
            _super.prototype.OnResize.call(this);
            this.Title.Position.Set(this.Stage.Size.x / 2, this.Stage.Size.y / 3);
        };
        return SplashScreen;
    }(state.AbstractState));
    state.SplashScreen = SplashScreen;
})(state || (state = {}));
/// <reference path="../declare/es6-promise.d.ts" />
var core;
(function (core) {
    core.ImageLoader = {
        load: function (url) {
            return new Promise(function (resolve, reject) {
                var img = new Image();
                img.onload = function () { return resolve(img); };
                img.onerror = function (e) { return reject(e); };
                img.src = url;
            });
        }
    };
})(core || (core = {}));
/// <reference path="Vector2.ts" />
var core;
(function (core) {
    /**
     * Class represents 2 dimensional rectangle.
     */
    var Rect = (function () {
        function Rect(x, y, width, height) {
            this.Position = new core.Vector(x, y);
            this.Size = new core.Vector(width, height);
        }
        Rect.prototype.Clone = function (out) {
            out = out || new Rect(0, 0, 0, 0);
            this.Position.Clone(out.Position);
            this.Size.Clone(out.Size);
            return out;
        };
        return Rect;
    }());
    core.Rect = Rect;
})(core || (core = {}));
/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../core/ImageLoader.ts" />
/// <reference path="../core/Rect.ts" />
var gfx;
(function (gfx) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(x, y, key, sourceRect) {
            _super.call(this, x, y, 0, 0);
            if (this.Image = Sprite.ImageCache[key]) {
                this.SourceRect = sourceRect ? sourceRect.Clone()
                    : new core.Rect(0, 0, this.Image.width, this.Image.height);
                this.SourceRect.Size.Clone(this.Size);
            }
            else
                throw Error("Couldn't find " + key + " in cache");
        }
        Sprite.prototype.DrawSelf = function (ctx) {
            if (this.Image) {
                ctx.drawImage(this.Image, this.SourceRect.Position.x, this.SourceRect.Position.y, this.SourceRect.Size.x, this.SourceRect.Size.y, 0, 0, this.Size.x, this.Size.y);
            }
            else {
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'red';
                ctx.rect(0, 0, this.Size.x, this.Size.y);
                ctx.fill();
                ctx.stroke();
            }
        };
        /**
         * @param urls [key, url]
         */
        Sprite.Load = function () {
            var urls = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                urls[_i - 0] = arguments[_i];
            }
            return Promise.all(urls.map(function (_a) {
                var key = _a[0], url = _a[1];
                return core.ImageLoader.load(url).then(function (img) { return Sprite.ImageCache[key] = img; });
            }));
        };
        Sprite.ImageCache = {};
        return Sprite;
    }(core.DisplayObject));
    gfx.Sprite = Sprite;
})(gfx || (gfx = {}));
var core;
(function (core) {
    function Assert(expr, msg) {
        if (!expr)
            throw new Error("Assertion failed. " + (msg || ""));
    }
    core.Assert = Assert;
})(core || (core = {}));
/// <reference path="Sprite.ts" />
/// <reference path="../core/Assert.ts" />
var gfx;
(function (gfx) {
    /**
     * A sprite factory, extracts sprites from image.
     */
    var SpriteSheet = (function () {
        function SpriteSheet(ImageId, CellSize, 
            /**
             * This offset will be just used for sprite extraction. It won't be counted
             * in any sanity checks.
             */
            Offset) {
            if (Offset === void 0) { Offset = new core.Vector(); }
            this.ImageId = ImageId;
            this.CellSize = CellSize;
            this.Offset = Offset;
            this.ImageSize = new core.Vector();
            this.GridSize = new core.Vector();
            var tileset = gfx.Sprite.ImageCache[ImageId];
            if (tileset) {
                this.ImageSize.Set(tileset.width, tileset.height);
                this.UpdateGridSize();
            }
            else {
                throw new Error("Tileset with given id " + ImageId + " doesn't exsit.");
            }
        }
        SpriteSheet.prototype.GetSprite = function (id) {
            core.Assert(id >= 1, "Sprites id have to be greater than 0.");
            return new gfx.Sprite(0, 0, this.ImageId, this.GetSourceRect(id));
        };
        SpriteSheet.prototype.GetSourceRect = function (id) {
            if (id < 1) {
                return undefined;
            }
            id = id - 1;
            var x = id % this.GridSize.x;
            var y = Math.floor(id / this.GridSize.x);
            core.Assert(x < this.GridSize.x && y < this.GridSize.y, "Sprite id:" + id + " is out of bounds.");
            return new core.Rect(x * this.CellSize.x + this.Offset.x, y * this.CellSize.y + this.Offset.y, this.CellSize.x, this.CellSize.y);
        };
        SpriteSheet.prototype.UpdateGridSize = function () {
            var cols = this.ImageSize.x / this.CellSize.x;
            var rows = this.ImageSize.y / this.CellSize.y;
            core.Assert(cols % 1 === 0, "Width of image doesn't match grid size.");
            core.Assert(rows % 1 === 0, "Height of image doesn't match grid size.");
            this.GridSize.Set(cols, rows);
        };
        return SpriteSheet;
    }());
    gfx.SpriteSheet = SpriteSheet;
})(gfx || (gfx = {}));
/// <reference path="../core/DisplayObject.ts" />
/// <reference path="SpriteSheet.ts" />
var gfx;
(function (gfx) {
    var TileLayer = (function (_super) {
        __extends(TileLayer, _super);
        function TileLayer(x, y, TileSet, Data, CellSize) {
            if (CellSize === void 0) { CellSize = TileSet.CellSize; }
            _super.call(this, x, y);
            this.TileSet = TileSet;
            this.Data = Data;
            this.CellSize = CellSize;
            this.GridSize = new core.Vector();
            this.BuildLayer();
        }
        TileLayer.prototype.BuildLayer = function () {
            var _this = this;
            core.Assert(this.Data.length > 0, "Layer data can't be null.");
            core.Assert(this.Data.every(function (row) { return row.length === _this.Data[0].length; }), "Each row has to have the same length.");
            this.Data.forEach(function (row, y) {
                row.forEach(function (id, x) {
                    if (id == 0)
                        return;
                    var tile = _this.TileSet.GetSprite(id);
                    tile.Position.Set(x * _this.CellSize.x, y * _this.CellSize.y);
                    _this.AddChild(tile);
                });
            });
            this.GridSize.Set(this.Data[0].length, this.Data.length);
            core.vector.Multiply(this.GridSize, this.CellSize, this.Size);
        };
        return TileLayer;
    }(core.Layer));
    gfx.TileLayer = TileLayer;
})(gfx || (gfx = {}));
/// <reference path="../gfx/SpriteSheet.ts" />
var game;
(function (game) {
    // Index in spritesheet with cell size 24x24 and image width 240
    game.assets = {
        HERO_FACE_UP: 1,
        HERO_FACE_LEFT: 2,
        HERO_FACE_RIGHT: 3,
        HERO_FALLING: 4,
        HERO_LANDING: [5, 6, 7, 8],
        // these have difference index since, this index is counted from
        // grid [24, 48] with offset [0,24]
        FLOATING_TILE_FRAMES: [1, 2, 3, 4, 5],
        SMALL_SHADOW: 31,
        HEART: [35, 36],
        ATTACK_BONUS: 34,
        SWORD: [71, 72, 73, 74, 75, 76, 77, 78],
        TORCH_FRAMES: [41, 42, 43, 44],
        HEART_FRAME: 37,
        HEART_FILL: 38,
        // same grid as floating tile frames
        RED_DEMON_FRAMES: [21, 22],
        BLUE_DEMON_FRAMES: [23, 24],
        GREEN_DEMON_FRAMES: [25, 26],
        PURPLE_DEMON_FRAMES: [27, 28],
        DARK_DEMON_FRAMES: [29, 30],
        // gui of fight scene
        // just position on 24x24 grid, size is different.
        FIGHT_DEMON_HEALTHBAR: 81,
        FIGHT_DEMON_MOUTH: {
            // index in 24x24 grid of top left pixel of image 64x64
            // size is manually changed.
            RED: [91, 94]
        },
        // Size 40x40    
        FIGHT_LIGHT_CONE: 97
    };
})(game || (game = {}));
var game;
(function (game) {
    var data;
    (function (data) {
        var layer;
        (function (layer) {
            var _ = 1; // ground tile
            var t = 2; // torch
            var h = 3; // hero
            var r = 4; // red demon or item, blue demon or item
            var g = 5; // green demon or item, purple demon or item 
            var f = 6; // final demon
            var x = 11; // tiles that are unlocked when you kill all demons
            layer.ground = [
                [0, 0, 0, 0, x, 0, 0, 0, 0],
                [0, 0, 0, 0, x, 0, 0, 0, 0],
                [0, 0, 0, 0, x, 0, 0, 0, 0],
                [_, 0, _, 0, x, 0, _, 0, _],
                [_, 0, _, 0, x, 0, _, 0, _],
                [_, _, _, _, _, _, _, _, _],
                [0, 0, 0, 0, _, 0, 0, 0, 0],
                [_, 0, _, 0, _, 0, _, 0, _],
                [_, 0, _, 0, _, 0, _, 0, _],
                [_, _, _, _, _, _, _, _, _],
                [0, 0, 0, _, 0, 0, 0, 0, 0],
                [0, 0, 0, _, _, 0, 0, 0, 0],
                [0, 0, 0, 0, _, 0, 0, 0, 0],
                [0, 0, 0, 0, _, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            // export const static: number[][] = [
            //     [0, 0, 0, 0],
            //     [0, 0, 0, 0],
            //     [0, 0, 0, 0],
            //     [0, 0, 0, 0],
            //     [0, 0, 0, 0]
            // ];
            layer.actors = [
                [0, 0, 0, t, f, t, 0, 0, 0],
                [0, 0, 0, t, 0, t, 0, 0, 0],
                [0, 0, 0, t, 0, t, 0, 0, 0],
                [g, 0, g, t, 0, t, g, 0, g],
                [0, 0, 0, t, 0, t, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [r, 0, r, 0, 0, 0, r, 0, r],
                [0, t, 0, 0, 0, 0, 0, t, 0],
                [0, 0, 0, 0, h, 0, 0, 0, 0],
                [0, 0, 0, 0, t, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
        })(layer = data.layer || (data.layer = {}));
    })(data = game.data || (game.data = {}));
})(game || (game = {}));
/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../core/Assert.ts" />
/// <reference path="SpriteSheet.ts" />
/// <reference path="../core/Math.ts" />
var gfx;
(function (gfx) {
    var Animation = (function () {
        function Animation(Frames, 
            /** List of tuple (time_point, frame_id) */
            Timeline, Duration, Loop) {
            if (Loop === void 0) { Loop = false; }
            this.Frames = Frames;
            this.Timeline = Timeline;
            this.Duration = Duration;
            this.Loop = Loop;
            this.Progress = 0;
            this.Name = 'unnamed';
            core.Assert(this.Duration > 0, "Duration has to be greater than 0.");
            core.Assert(this.Frames.length > 0, "Frames can't be empty.");
            core.Assert(this.Timeline.every(function (_a) {
                var point = _a[0], _ = _a[1];
                return point >= 0 && point <= 1;
            }), "Timeline point has to be in range [0, 1].");
            core.Assert(this.Timeline.every(function (_a, i, frames) {
                var point = _a[0], _ = _a[1];
                if (i < frames.length - 1)
                    return point < frames[i + 1][0];
                else
                    return point < 1;
            }), "Point on timeline has to be in ascending order.");
        }
        Animation.prototype.Update = function (timeDelta) {
            this.Progress += timeDelta / this.Duration;
            if (this.Loop && this.Progress > 1) {
                this.Progress -= 1;
            }
            this.Progress = core.math.Clamp(this.Progress, 0, 1);
        };
        Animation.prototype.GetFrame = function (progress) {
            if (progress === void 0) { progress = this.Progress; }
            for (var i = this.Timeline.length - 1; i >= 0; --i) {
                var _a = this.Timeline[i], point = _a[0], frame = _a[1];
                if (point <= progress)
                    return this.Frames[frame];
            }
            return undefined;
        };
        Animation.prototype.IsDone = function () {
            return this.Progress === 1;
        };
        Animation.prototype.Reset = function () {
            this.Progress = 0;
        };
        return Animation;
    }());
    var Animator = (function () {
        function Animator() {
            this.Animations = {};
        }
        Animator.prototype.AddAnimation = function (name, indices, data) {
            core.Assert(this.Animations[name] === undefined, "Can't override animation " + name);
            if (data instanceof gfx.SpriteSheet) {
                return this.AddAnimation_S(name, indices, data);
            }
            else {
                return this.AddAnimation_D(name, indices, data);
            }
        };
        Animator.prototype.Play = function (name) {
            core.Assert(this.Animations[name] !== undefined, "Animation doesn't exist");
            if (this.ActiveAnimation && this.ActiveAnimation.IsDone()) {
                this.ActiveAnimation.Reset();
            }
            this.ActiveAnimation = this.Animations[name];
        };
        Animator.prototype.RestartAnimation = function () {
            if (this.ActiveAnimation) {
                this.ActiveAnimation.Reset();
            }
        };
        Animator.prototype.Update = function (timeDelta) {
            if (this.ActiveAnimation) {
                this.ActiveAnimation.Update(timeDelta);
            }
        };
        Animator.prototype.GetFrame = function () {
            if (this.ActiveAnimation) {
                return this.ActiveAnimation.GetFrame();
            }
            else {
                throw new Error("There is no active frame.");
            }
        };
        Animator.prototype.IsAnimationDone = function (name) {
            return this.Animations[name].IsDone();
        };
        Animator.prototype.AddAnimation_S = function (name, indices, data) {
            var frames = indices
                .filter(function (item, pos) { return indices.indexOf(item) == pos; }) // remove duplicates
                .map(function (id) { return data.GetSprite(id); });
            indices = indices.map(function (idx) { return indices.indexOf(idx); });
            return this.AddAnimation_D(name, indices, frames);
        };
        Animator.prototype.AddAnimation_D = function (name, indices, frames) {
            var timeline = indices.map(function (idx, pos) { return [pos / indices.length, idx]; });
            var anim = this.Animations[name] = new Animation(frames, timeline, 1);
            anim.Name = name;
            return anim;
        };
        return Animator;
    }());
    gfx.Animator = Animator;
})(gfx || (gfx = {}));
/// <reference path="Animator.ts" />
var gfx;
(function (gfx) {
    var AnimatedSprite = (function (_super) {
        __extends(AnimatedSprite, _super);
        function AnimatedSprite(x, y, width, height, Animator) {
            if (Animator === void 0) { Animator = new gfx.Animator(); }
            _super.call(this, x, y, width, height);
            this.Animator = Animator;
        }
        AnimatedSprite.prototype.DrawSelf = function (ctx) {
            this.Animator.GetFrame().Draw(ctx);
        };
        AnimatedSprite.prototype.Update = function (timeDelta) {
            this.Animator.Update(timeDelta);
        };
        return AnimatedSprite;
    }(core.DisplayObject));
    gfx.AnimatedSprite = AnimatedSprite;
})(gfx || (gfx = {}));
/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../core/Timer.ts" />
/// <reference path="../core/Tween.ts" />
/// <reference path="../gfx/AnimatedSprite.ts" />
var game;
(function (game) {
    /**
     * Anything that need take some actions in game and wants to be displayed./
     */
    var Actor = (function (_super) {
        __extends(Actor, _super);
        function Actor(x, y, width, height) {
            _super.call(this, x, y, width, height);
            /** this is just marker */
            this.IsActive = true;
            this.GridPosition = new core.Vector();
            this.Timer = new core.TimersManager();
            this.Tween = new core.TweenManager();
            this.EnableSubpixelMovement = false;
        }
        Actor.prototype.Update = function (timeDelta) {
            this.Timer.Update(timeDelta);
            this.Tween.Update(timeDelta);
            // Forbids subpixel movements
            if (!this.EnableSubpixelMovement) {
                this.Position.Set(Math.floor(this.Position.x), Math.floor(this.Position.y));
            }
        };
        return Actor;
    }(core.DisplayObject));
    game.Actor = Actor;
    var AnimatedActor = (function (_super) {
        __extends(AnimatedActor, _super);
        function AnimatedActor() {
            _super.apply(this, arguments);
            this.Animator = new gfx.Animator();
            this.Sprite = new gfx.AnimatedSprite(0, 0, this.Size.x, this.Size.y, this.Animator);
        }
        AnimatedActor.prototype.Update = function (timeDelta) {
            _super.prototype.Update.call(this, timeDelta);
            this.Sprite.Update(timeDelta);
            // forbid subpixel movement
            if (!this.EnableSubpixelMovement) {
                this.Sprite.Position.Set(Math.floor(this.Sprite.Position.x), Math.floor(this.Sprite.Position.y));
            }
        };
        AnimatedActor.prototype.DrawSelf = function (ctx) {
            this.Sprite.Draw(ctx);
        };
        return AnimatedActor;
    }(Actor));
    game.AnimatedActor = AnimatedActor;
})(game || (game = {}));
var core;
(function (core) {
    var features;
    (function (features) {
        features.IsMobileBrowser = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    })(features = core.features || (core.features = {}));
})(core || (core = {}));
/// <reference path="../core/Features.ts" />
var audio;
(function (audio_1) {
    var AudioManager = (function () {
        function AudioManager() {
            this.Sounds = {};
            this.Volume = 1;
        }
        AudioManager.prototype.AddSound = function (key, data, poolCount) {
            if (poolCount === void 0) { poolCount = 1; }
            var pool = [];
            poolCount = core.features.IsMobileBrowser ? 0 : poolCount;
            for (var i = 0; i < poolCount; ++i) {
                var soundURL = jsfxr(data);
                var audio_2 = new Audio();
                audio_2.src = soundURL;
                pool.push(audio_2);
            }
            this.Sounds[key] = {
                index: 0,
                pool: pool
            };
        };
        AudioManager.prototype.Play = function (key, volume) {
            if (volume === void 0) { volume = 1; }
            var sound = this.Sounds[key], audio = sound.pool[(sound.index++) % sound.pool.length];
            if (audio) {
                audio.volume = volume * this.Volume;
                audio.play();
            }
        };
        return AudioManager;
    }());
    audio_1.manager = new AudioManager();
})(audio || (audio = {}));
/// <reference path="../Actor.ts" />
/// <reference path="../../audio/AudioManager.ts" />
var game;
(function (game) {
    var JUMP_DURATION = 0.5;
    var VANISH_TIME = 2;
    audio.manager.AddSound('landing', [0, , 0.0785, , 0.2923, 0.7043, , -0.5667, 0.0112, , , 0.0145, , 0.2016, , 0.0033, , -0.0354, 0.9802, , , 0.0297, , 0.5]);
    var AHero = (function (_super) {
        __extends(AHero, _super);
        function AHero(x, y, sheet) {
            _super.call(this, x, y, 24, 24);
            this.Face = 'left';
            this.Animator.AddAnimation('left', [game.assets.HERO_FACE_LEFT], sheet);
            this.Animator.AddAnimation('right', [game.assets.HERO_FACE_RIGHT], sheet);
            this.Animator.AddAnimation('up', [game.assets.HERO_FACE_UP], sheet);
            this.Animator.AddAnimation('falling', [game.assets.HERO_FALLING], sheet);
            this.Animator.AddAnimation('landing', game.assets.HERO_LANDING, sheet).Duration = 0.7;
            this.Shadow = sheet.GetSprite(game.assets.SMALL_SHADOW);
            this.Animator.Play('left');
            this.SetupDustParticles();
            this.Alpha = 0;
            this.IsActive = false;
        }
        AHero.prototype.DrawSelf = function (ctx) {
            this.Shadow.Draw(ctx);
            this.DustParticles.Draw(ctx);
            this.Sprite.Draw(ctx);
        };
        AHero.prototype.PlayJump = function (dest) {
            var _this = this;
            this.UpdateFace(dest);
            return this.Tween.New(this.Position)
                .To({ x: dest.x, y: dest.y }, JUMP_DURATION, core.easing.SinusoidalInOut)
                .Parallel(this.Sprite.Position, function (t) { return t
                .To({ y: _this.Sprite.Position.y - 10 }, JUMP_DURATION / 2, core.easing.CubicOut)
                .Then()
                .To({ y: _this.Sprite.Position.y }, JUMP_DURATION / 2); })
                .WhenDone(function () { return audio.manager.Play('landing'); })
                .Start();
        };
        AHero.prototype.PlayDead = function (fallDistance) {
            var _this = this;
            if (fallDistance === void 0) { fallDistance = 10; }
            return this.Tween.New(this)
                .To({ Alpha: 0 }, VANISH_TIME)
                .Parallel(this.Position, function (t) { return t
                .To({ y: _this.Position.y + fallDistance }, VANISH_TIME, core.easing.CubicOut); })
                .Start();
        };
        AHero.prototype.FallFromHeaven = function () {
            var _this = this;
            var top = this.ToLocal(new core.Vector(GAME.Canvas.width / 2, 0));
            this.Sprite.Position.Set(top.x - 12, top.y - 24);
            console.log("hero pos " + this.Sprite.Position);
            this.Animator.Play('falling');
            this.Alpha = 1;
            return this.Tween.New(this.Sprite.Position)
                .To({ x: 0, y: 0 }, 1, core.easing.CubicIn)
                .WhenDone(function () {
                game.context.PlayState.ShakeScreen(0.5);
                _this.EmitParticles();
            })
                .Then()
                .Delay(1.5)
                .WhenDone(function () {
                _this.Animator.Play('landing');
                _this.IsActive = true;
            })
                .Then()
                .Delay(1)
                .WhenDone(function () { return _this.Animator.Play('left'); })
                .Start();
        };
        AHero.prototype.UpdateFace = function (dest) {
            if (dest.y - this.Position.y < 0) {
                this.Face = 'up';
            }
            else {
                this.Face = dest.x - this.Position.x > 0 ? 'right' : 'left';
            }
            this.Animator.Play(this.Face);
        };
        AHero.prototype.EmitParticles = function () {
            var _this = this;
            this.DustParticles.Visible = true;
            this.DustParticles.Children.forEach(function (dust) {
                dust.Position.Set(12, 15);
                dust.Size.Set(1, 1);
                var dest = new core.Vector(0, 1);
                core.vector.Rotate(dest, core.Random(-Math.PI, Math.PI));
                core.vector.Scale(dest, 8);
                core.vector.Add(dust.Position, dest, dest);
                var DUST_TIME = 1;
                dust.Alpha = 0;
                _this.Tween.New(dust.Position)
                    .To({ x: dest.x, y: dest.y - 3 }, DUST_TIME)
                    .OnUpdate(function () {
                    dust.Position.Set(dust.Position.x | 0, dust.Position.y | 0);
                })
                    .Parallel(dust, function (t) { return t
                    .To({ Alpha: 1 }, DUST_TIME / 2)
                    .Then()
                    .To({ Alpha: 0 }, DUST_TIME / 2); })
                    .Start();
            });
        };
        AHero.prototype.SetupDustParticles = function () {
            this.DustParticles = new core.Layer();
            this.DustParticles.Alpha = 0.2;
            this.DustParticles.Visible = false;
            for (var i = 0; i < 40; ++i) {
                // let s = sheet.GetSprite(i % 2 ? assets.DUST_CLOUD_1: assets.DUST_CLOUD_2);
                var s = new gfx.Rectangle(0, 0, 2, 2, { fillStyle: '#c0c0c0' });
                this.DustParticles.AddChild(s);
            }
            ;
        };
        return AHero;
    }(game.AnimatedActor));
    game.AHero = AHero;
})(game || (game = {}));
var game;
(function (game) {
    var Context = (function () {
        function Context() {
            // ids of killed demons
            this.KilledDemons = [];
            // ids of picked up items
            this.AquiredItems = [];
            // number of player lifes
            this.LifesLeft = 3;
        }
        Context.prototype.IsOnlyBossAlive = function () {
            return this.KilledDemons.length === 4;
        };
        Context.prototype.AllDemonsKilled = function () {
            return this.KilledDemons.length === 5;
        };
        Context.prototype.PlayerHas = function (itemName) {
            return this.AquiredItems.indexOf(itemName) !== -1;
        };
        Context.prototype.Reset = function () {
            console.log("Reseting context.");
            game.context = new Context();
        };
        return Context;
    }());
    game.context = new Context();
})(game || (game = {}));
/// <reference path="../core/DisplayObject.ts" />
/// <reference path="IStyle.ts" />
var gfx;
(function (gfx) {
    var Rectangle = (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(x, y, width, height, Style) {
            if (Style === void 0) { Style = { fillStyle: 'red' }; }
            _super.call(this, x, y, width, height);
            this.Style = Style;
        }
        Rectangle.prototype.DrawSelf = function (ctx) {
            if (this.Style.compositeOperation) {
                ctx.globalCompositeOperation = this.Style.compositeOperation;
            }
            if (this.Style.fillStyle) {
                ctx.fillStyle = this.Style.fillStyle;
                ctx.fillRect(0, 0, this.Size.x, this.Size.y);
            }
            if (this.Style.strokeStyle) {
                ctx.lineWidth = this.Style.lineWidth || 1;
                ctx.strokeStyle = this.Style.strokeStyle;
                ctx.strokeRect(0, 0, this.Size.x, this.Size.y);
            }
        };
        return Rectangle;
    }(core.DisplayObject));
    gfx.Rectangle = Rectangle;
})(gfx || (gfx = {}));
var core;
(function (core) {
    function Random(min, max) {
        if (max < min)
            throw Error();
        return min + Math.random() * (max - min);
    }
    core.Random = Random;
    function TossCoin(a, b) {
        return Math.random() > 0.5 ? a : b;
    }
    core.TossCoin = TossCoin;
    function RandomElement(array) {
        return array[(Math.random() * array.length) | 0];
    }
    core.RandomElement = RandomElement;
})(core || (core = {}));
/// <reference path="../Actor.ts" />
/// <reference path="../Assets.ts" />
/// <reference path="../Context.ts" />
/// <reference path="../../gfx/Rectangle.ts" />
/// <reference path="../../audio/AudioManager.ts" />
/// <reference path="../../core/Random.ts" />
var game;
(function (game) {
    var COLLAPSE_TIME = 1.0;
    var DUST_TIME = 4.0;
    // audio.manager.AddSound('collapse', [3,,0.301,0.503,0.4639,0.0611,,-0.2594,,,,,,,,0.3472,0.0106,-0.0356,1,,,,,0.5]); 			
    audio.manager.AddSound('collapse', [3, , 0.301, 0.59, 0.63, 0.12, , -0.2594, , , , , , , , 0.3472, 0.0106, -0.0356, 1, , , , , 0.5], 5);
    var AFloatingTile = (function (_super) {
        __extends(AFloatingTile, _super);
        function AFloatingTile(x, y, sheetId) {
            _super.call(this, x, y, 24, 48);
            var sheet = new gfx.SpriteSheet(sheetId, new core.Vector(24, 48), new core.Vector(0, 24));
            this.Animator.AddAnimation('collapse', game.assets.FLOATING_TILE_FRAMES, sheet);
            this.Animator.AddAnimation('raise', game.assets.FLOATING_TILE_FRAMES.slice(0).reverse(), sheet);
            this.Animator.AddAnimation('idle', [game.assets.FLOATING_TILE_FRAMES[0]], sheet);
            this.Animator.Play('idle');
            this.SetupDustParticles();
        }
        AFloatingTile.prototype.Collapse = function () {
            var pos = this.Sprite.Position;
            this.IsActive = false;
            audio.manager.Play('collapse', 0.5);
            this.Animator.Play('collapse');
            this.Tween.New(pos)
                .To({ y: pos.y + 15 }, COLLAPSE_TIME)
                .OnUpdate(function () { return pos.Set(pos.x | 0, pos.y | 0); })
                .Parallel(this.Sprite, function (t) { return t
                .To({ Alpha: 0 }, COLLAPSE_TIME); })
                .Parallel(null, function (t) { return t
                .Delay(0.25)
                .WhenDone(function () {
                game.context.PlayState.ShakeScreen(0.5);
            }); })
                .Then()
                .To({ y: pos.y }, 0.01)
                .Start();
            this.EmitParticles();
        };
        AFloatingTile.prototype.Raise = function () {
            var _this = this;
            var pos = this.Sprite.Position;
            pos.y += 15;
            this.Animator.Play('raise');
            this.Tween.New(pos)
                .To({ y: pos.y - 15 }, COLLAPSE_TIME)
                .OnUpdate(function () { return pos.Set(pos.x | 0, pos.y | 0); })
                .Parallel(this.Sprite, function (t) { return t
                .To({ Alpha: 1 }, COLLAPSE_TIME); })
                .Start()
                .WhenDone(function () { return _this.Animator.Play('idle'); });
        };
        AFloatingTile.prototype.RaiseWhenVisible = function () {
            var _this = this;
            this.Visible = false;
            this.Sprite.Alpha = 0;
            var timer = this.Timer.Repeat(0, function () {
                if (_this.Visible) {
                    _this.Raise();
                    timer.Stop();
                }
            });
        };
        AFloatingTile.prototype.DrawSelf = function (ctx) {
            this.Sprite.Draw(ctx);
            this.DustPartices.Draw(ctx);
        };
        AFloatingTile.prototype.EmitParticles = function () {
            var _this = this;
            this.DustPartices.Visible = true;
            this.DustPartices.Children.forEach(function (dust) {
                dust.Position.Set(24 / 2 + core.Random(-6, 6), 20 + core.Random(-2, 2));
                dust.Size.Set(1, 1);
                var dest = new core.Vector(0, 1);
                core.vector.Rotate(dest, core.Random(-Math.PI, Math.PI));
                core.vector.Scale(dest, 8);
                core.vector.Add(dust.Position, dest, dest);
                dust.Alpha = 0;
                _this.Tween.New(dust.Position)
                    .Delay(COLLAPSE_TIME / 2)
                    .Then()
                    .To({ x: dest.x, y: dest.y - 15 }, DUST_TIME)
                    .OnUpdate(function () {
                    dust.Position.Set(dust.Position.x | 0, dust.Position.y | 0);
                })
                    .Parallel(dust, function (t) { return t
                    .To({ Alpha: 1 }, 1)
                    .Then()
                    .To({ Alpha: 0 }, DUST_TIME - 1); })
                    .Start();
            });
        };
        AFloatingTile.prototype.SetupDustParticles = function () {
            this.DustPartices = new core.Layer();
            this.DustPartices.Alpha = 0.2;
            this.DustPartices.Visible = false;
            for (var i = 0; i < 40; ++i) {
                // let s = sheet.GetSprite(i % 2 ? assets.DUST_CLOUD_1: assets.DUST_CLOUD_2);
                var s = new gfx.Rectangle(0, 0, 2, 2, { fillStyle: '#c0c0c0' });
                this.DustPartices.AddChild(s);
            }
            ;
        };
        return AFloatingTile;
    }(game.AnimatedActor));
    game.AFloatingTile = AFloatingTile;
})(game || (game = {}));
/// <reference path="../Actor.ts" />
var game;
(function (game) {
    var ATorch = (function (_super) {
        __extends(ATorch, _super);
        function ATorch(x, y, sheet) {
            _super.call(this, x, y, sheet.CellSize.x, sheet.CellSize.y);
            var a = this.Animator.AddAnimation('idle', game.assets.TORCH_FRAMES, sheet);
            a.Loop = true;
            this.Animator.Play('idle');
        }
        return ATorch;
    }(game.AnimatedActor));
    game.ATorch = ATorch;
})(game || (game = {}));
/// <reference path="../Actor.ts" />
/// <reference path="../../gfx/Text.ts" />
var game;
(function (game) {
    var AText = (function (_super) {
        __extends(AText, _super);
        function AText(x, y, txt) {
            _super.call(this, x, y, 0, 0);
            this.Label = new gfx.AAText(0, 0, txt);
            this.Label.SetSize(5);
            this.Label.Size.Clone(this.Size);
        }
        AText.prototype.DrawSelf = function (ctx) {
            this.Label.Draw(ctx);
        };
        return AText;
    }(game.Actor));
    game.AText = AText;
})(game || (game = {}));
/// <reference path="../Actor.ts" />
var game;
(function (game) {
    var ADemon = (function (_super) {
        __extends(ADemon, _super);
        function ADemon(x, y, frames, sheet, Name) {
            _super.call(this, x, y, 24, 24 * 2);
            this.Name = Name;
            sheet = new gfx.SpriteSheet(sheet.ImageId, new core.Vector(24, 48), new core.Vector(0, 24));
            this.Animator.AddAnimation('idle', frames, sheet).Loop = true;
            this.Animator.Play('idle');
            this.Sprite.Position.y -= 17;
            console.log("Spawning " + Name);
        }
        return ADemon;
    }(game.AnimatedActor));
    game.ADemon = ADemon;
    var ARedDemon = (function (_super) {
        __extends(ARedDemon, _super);
        function ARedDemon(x, y, sheet) {
            _super.call(this, x, y, game.assets.RED_DEMON_FRAMES, sheet, "Red");
        }
        return ARedDemon;
    }(ADemon));
    game.ARedDemon = ARedDemon;
    var ABlueDemon = (function (_super) {
        __extends(ABlueDemon, _super);
        function ABlueDemon(x, y, sheet) {
            _super.call(this, x, y, game.assets.BLUE_DEMON_FRAMES, sheet, "Blue");
        }
        return ABlueDemon;
    }(ADemon));
    game.ABlueDemon = ABlueDemon;
    var AGreenDemon = (function (_super) {
        __extends(AGreenDemon, _super);
        function AGreenDemon(x, y, sheet) {
            _super.call(this, x, y, game.assets.GREEN_DEMON_FRAMES, sheet, "Green");
        }
        return AGreenDemon;
    }(ADemon));
    game.AGreenDemon = AGreenDemon;
    var APurpleDemon = (function (_super) {
        __extends(APurpleDemon, _super);
        function APurpleDemon(x, y, sheet) {
            _super.call(this, x, y, game.assets.PURPLE_DEMON_FRAMES, sheet, "Purple");
        }
        return APurpleDemon;
    }(ADemon));
    game.APurpleDemon = APurpleDemon;
    var ADarkDemon = (function (_super) {
        __extends(ADarkDemon, _super);
        function ADarkDemon(x, y, sheet) {
            _super.call(this, x, y, game.assets.DARK_DEMON_FRAMES, sheet, "Dark");
        }
        return ADarkDemon;
    }(ADemon));
    game.ADarkDemon = ADarkDemon;
})(game || (game = {}));
/// <reference path="../Actor.ts" />
var game;
(function (game) {
    var AItem = (function (_super) {
        __extends(AItem, _super);
        function AItem(x, y, frames, sheet, Name) {
            _super.call(this, x, y, 24, 24);
            this.Name = Name;
            this.Animator.AddAnimation('idle', frames, sheet).Loop = true;
            this.Animator.Play('idle');
            this.Shadow = sheet.GetSprite(game.assets.SMALL_SHADOW);
            this.Tween.New(this.Sprite.Position)
                .To({ y: -5 }, 1, core.easing.SinusoidalInOut)
                .Then()
                .To({ y: 0 }, 1, core.easing.SinusoidalInOut)
                .Then()
                .Loop()
                .Start();
        }
        AItem.prototype.DrawSelf = function (ctx) {
            this.Shadow.Draw(ctx);
            this.Sprite.Draw(ctx);
        };
        AItem.prototype.ShowInGlory = function () {
            this.Tween.StopAll(false);
            return this.Tween.New(this.Sprite.Position)
                .To({ y: -18 }, 1, core.easing.CubicOut)
                .Start();
        };
        return AItem;
    }(game.AnimatedActor));
    game.AItem = AItem;
    var ALifeBonus = (function (_super) {
        __extends(ALifeBonus, _super);
        function ALifeBonus(x, y, sheet) {
            _super.call(this, x, y, game.assets.HEART, sheet, 'Life');
        }
        ALifeBonus.prototype.GetDescription = function () {
            return ["hitpoints", "increased"];
        };
        return ALifeBonus;
    }(AItem));
    game.ALifeBonus = ALifeBonus;
    var AAttackBonus = (function (_super) {
        __extends(AAttackBonus, _super);
        function AAttackBonus(x, y, sheet) {
            _super.call(this, x, y, game.assets.SWORD, sheet, 'Attack');
        }
        AAttackBonus.prototype.GetDescription = function () {
            return ["attack", "increased"];
        };
        return AAttackBonus;
    }(AItem));
    game.AAttackBonus = AAttackBonus;
})(game || (game = {}));
/// <reference path="../core/DisplayObject.ts" />
/// <reference path="../gfx/TileLayer.ts" />
/// <reference path="Assets.ts" />
/// <reference path="PurgatoryData.ts" />
/// <reference path="actors/AHero.ts" />
/// <reference path="actors/AFloatingTile.ts" />
/// <reference path="actors/ATorch.ts" />
/// <reference path="actors/AText.ts" />
/// <reference path="actors/ADemon.ts" />
/// <reference path="actors/AItem.ts" />
/// <reference path="Context.ts" />
var game;
(function (game) {
    var LEVEL_1_DEMONS = ['Red', 'Blue'];
    var LEVEL_2_DEMONS = ['Green', 'Purple'];
    var LEVEL_1_ITEMS = ['Attack', 'Life'];
    var LEVEL_2_ITEMS = ['Punch', 'Light'];
    var LEVEL_BOSS = ['Dark'];
    var TMP_VEC = new core.Vector();
    var CULL_OFFSET = 24 * 4;
    /**
     * Purgatory layout, should be generated once per page load/game load.
     */
    var PURGATORY_LAYOUT = (function () {
        var $ = core.ShuffleArray;
        var lvl2demons = $(LEVEL_2_DEMONS), lvl2items = $(LEVEL_2_ITEMS), lvl1demons = $(LEVEL_1_DEMONS), lvl1items = $(LEVEL_1_ITEMS);
        // top boss -> index 0            
        return LEVEL_BOSS.concat(
        // level 2 items and bosses
        $([lvl2demons[0], lvl2items[0]]).concat($([lvl2demons[1], lvl2items[1]])).concat(
        // level 1 items and bosses
        $([lvl1demons[0], lvl1items[0]]).concat($([lvl1demons[1], lvl1items[1]]))));
    })();
    var Purgatory = (function (_super) {
        __extends(Purgatory, _super);
        function Purgatory(x, y) {
            _super.call(this, x, y);
            // first layer to be rendered.
            this.GroundLayer = new core.Layer();
            // 2d array of references to ground tiles.
            // first acces is row and the cols, so actor = GroundLookup[y][x]
            this.GroundLookup = [];
            // living object rendered on top of other layers.
            this.ActorLayer = new core.Layer();
            this.Demons = [];
            this.Items = [];
            this.Timer = new core.TimersManager();
            game.context.Purgatory = this;
            this.SpriteSheet = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            this.Spawner = new ContextSpawner(this.SpriteSheet);
            this.BuildTileLayers();
            this.Size.Set(game.data.layer.ground[0].length, game.data.layer.ground.length);
            core.vector.Scale(this.Size, 24, this.Size);
        }
        Purgatory.prototype.Update = function (timeDelta) {
            // actor screen position 
            var screen = TMP_VEC;
            for (var _i = 0, _a = this.GroundLayer.Children; _i < _a.length; _i++) {
                var actor = _a[_i];
                actor.Update(timeDelta);
                this.ToGlobal(actor.Position, screen);
                actor.Visible = screen.x > -CULL_OFFSET && screen.x < GAME.Canvas.width && screen.y > -CULL_OFFSET && screen.y < GAME.Canvas.height;
            }
            for (var _b = 0, _c = this.ActorLayer.Children; _b < _c.length; _b++) {
                var actor = _c[_b];
                actor.Update(timeDelta);
                this.ToGlobal(actor.Position, screen);
                actor.Visible = screen.x > -CULL_OFFSET && screen.x < GAME.Canvas.width && screen.y > -CULL_OFFSET && screen.y < GAME.Canvas.height;
            }
            // console.log("clipped tiles",this.GroundLayer.Children.map(t => t.Visible ? 0 : 1).reduce((p,c) => p + c, 0), this.GroundLayer.Children.length,
            //     "clipped actors",this.ActorLayer.Children.map(t => t.Visible ? 0 : 1).reduce((p,c) => p + c, 0), this.ActorLayer.Children.length);
            this.Timer.Update(timeDelta);
        };
        Purgatory.prototype.MovePlayer = function (dir) {
            var _this = this;
            if (!this.Player.IsActive || this.Player.Tween.TweenPlaying())
                return;
            var dest = this.Player.GridPosition.Clone();
            switch (dir) {
                case 0 /* LEFT */:
                    dest.x -= 1;
                    break;
                case 2 /* UP */:
                    dest.y -= 1;
                    break;
                case 1 /* RIGHT */:
                    dest.x += 1;
                    break;
            }
            var futurePos = this.GridPosToLayerPos(dest);
            if (this.CanMoveTo(dest)) {
                var _a = this.Player.GridPosition, x = _a.x, y = _a.y;
                this.GroundLookup[y][x].Collapse();
                dest.Clone(this.Player.GridPosition);
                this.Player
                    .PlayJump(futurePos)
                    .WhenDone(function () { return _this.TileAction(_this.Player.GridPosition); });
            }
            else {
                this.Player.IsActive = false;
                this.Player
                    .PlayJump(futurePos)
                    .WhenDone(function () { return _this.PlayerDied(); });
            }
        };
        Purgatory.prototype.GridPosToLayerPos = function (grid, out) {
            if (out === void 0) { out = new core.Vector(); }
            core.vector.Multiply(grid, this.SpriteSheet.CellSize, out);
            return out;
        };
        Purgatory.prototype.PlayerDied = function () {
            this.Timer.Delay(1, function () { return game.context.PlayState.DimScreen(false, 1); });
            this.Player.PlayDead()
                .WhenDone(function () {
                game.context.LifesLeft -= 1;
                GAME.Play('you-died');
            });
        };
        Purgatory.prototype.TileAction = function (gridPos) {
            var _this = this;
            var _loop_1 = function(demon) {
                if (demon.GridPosition.x == gridPos.x && demon.GridPosition.y == gridPos.y) {
                    this_1.Player.IsActive = false;
                    // context.KilledDemons.push(demon.Name);
                    game.context.PlayState.Timers.Delay(0.7, function () {
                        game.context.PlayState.BlinkScreen(1);
                        game.context.PlayState.ShakeScreen(1).WhenDone(function () {
                            game.context.PlayState.BeginFigthMode(demon.Name);
                        });
                    });
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this.Demons; _i < _a.length; _i++) {
                var demon = _a[_i];
                _loop_1(demon);
            }
            var _loop_2 = function(item) {
                if (item.GridPosition.x == gridPos.x && item.GridPosition.y == gridPos.y) {
                    this_2.Player.IsActive = false;
                    game.context.AquiredItems.push(item.Name);
                    item.ShowInGlory();
                    this_2.ShowText(item.GetDescription()[0], 'white', 15);
                    this_2.ShowText(item.GetDescription()[1], 'white', 21)
                        .WhenDone(function () {
                        var _a = _this.Player.GridPosition, x = _a.x, y = _a.y;
                        _this.GroundLookup[y][x].Collapse();
                        item.Visible = false;
                        game.context.PlayState.DimScreen();
                        _this.Player.PlayDead(30)
                            .WhenDone(function () {
                            game.context.PlayState.RestartPurgatory();
                        });
                    });
                }
            };
            var this_2 = this;
            for (var _b = 0, _c = this.Items; _b < _c.length; _b++) {
                var item = _c[_b];
                _loop_2(item);
            }
            return false;
        };
        Purgatory.prototype.ShowText = function (msg, color, offsetY) {
            if (color === void 0) { color = 'white'; }
            if (offsetY === void 0) { offsetY = 0; }
            var center = new core.Vector(GAME.Canvas.width / 2, GAME.Canvas.height / 2);
            center = this.ToLocal(center);
            var text = new game.AText(0, center.y + offsetY, msg.toUpperCase());
            text.Label.SetColor(color);
            text.Anchor.Set(0.5, 0.5);
            text.Position.x = this.ToLocal(new core.Vector(GAME.Canvas.width, 0)).x + 20;
            // let bg = new gfx.Rectangle(center.x, center.y, this.Parent.Size.x, text.Size.y + 5, {fillStyle: "rgba(0, 0, 0, 0.5)"});
            // bg.Anchor.Set(0.5, 0.5);
            this.ActorLayer.AddChild(text);
            return text.Tween.New(text.Position)
                .To({ x: center.x }, 1, core.easing.SinusoidalInOut)
                .Then()
                .Delay(2)
                .Then()
                .To({ x: this.ToLocal(core.vector.Zero).x - 20 }, 1, core.easing.SinusoidalInOut)
                .Start()
                .WhenDone(function () {
                text.RemoveFromParent();
            });
        };
        Purgatory.prototype.CanMoveTo = function (gridPos) {
            if (gridPos.y < 0 || gridPos.y > this.GroundLookup.length - 1) {
                return false;
            }
            var tile = this.GroundLookup[gridPos.y][gridPos.x];
            if (tile) {
                return tile.IsActive;
            }
            return false;
        };
        Purgatory.prototype.BuildTileLayers = function () {
            var _this = this;
            game.data.layer.ground.forEach(function (row, y) {
                _this.GroundLookup.push([]);
                row.forEach(function (tileId, x) {
                    var tile;
                    switch (tileId) {
                        case 0: return;
                        case 1:
                            tile = new game.AFloatingTile(0, 0, _this.SpriteSheet.ImageId);
                            break;
                        // tiles unlocked when all bosess are killed 
                        case 11:
                            if (game.context.IsOnlyBossAlive()) {
                                tile = new game.AFloatingTile(0, 0, _this.SpriteSheet.ImageId);
                                tile.RaiseWhenVisible();
                            }
                            else {
                                return;
                            }
                            break;
                        default: throw new Error('tile not mapped.');
                    }
                    tile.GridPosition.Set(x, y);
                    core.vector.Multiply(tile.GridPosition, _this.SpriteSheet.CellSize, tile.Position);
                    _this.GroundLookup[y][x] = tile;
                    _this.GroundLayer.AddChild(tile);
                });
            });
            /**
             * Actor slots counted from the top of the map, so 0 should have the boss,
             * 1 should have the top left item/boss, and so on ...
             */
            var actorSlot = 0;
            game.data.layer.actors.forEach(function (row, y) {
                row.forEach(function (tileId, x) {
                    var actor;
                    switch (tileId) {
                        case 0: return;
                        case 2:
                            actor = new game.ATorch(0, 0, _this.SpriteSheet);
                            break;
                        case 3:
                            actor = _this.Player = new game.AHero(0, 0, _this.SpriteSheet);
                            _this.Timer.Delay(0.8, function () {
                                var fall = _this.Player.FallFromHeaven();
                                if (game.context.IsOnlyBossAlive()) {
                                    fall.WhenDone(function () {
                                        _this.CameraShowPathToFinalBoss();
                                    });
                                }
                            });
                            break;
                        case 4:
                        case 5:
                        case 6:
                            actor = _this.Spawner.SpawnActor(actorSlot++);
                            if (actor instanceof game.ADemon) {
                                _this.Demons.push(actor);
                            }
                            else if (actor instanceof game.AItem) {
                                _this.Items.push(actor);
                            }
                            else {
                                return;
                            }
                            break;
                        default:
                            console.error("actor not mapped. (" + tileId + ")");
                            return;
                    }
                    actor.GridPosition.Set(x, y);
                    core.vector.Multiply(actor.GridPosition, _this.SpriteSheet.CellSize, actor.Position);
                    _this.ActorLayer.AddChild(actor);
                });
            });
            this.AddChild(this.GroundLayer);
            this.AddChild(this.ActorLayer);
        };
        Purgatory.prototype.CameraShowPathToFinalBoss = function () {
            var _this = this;
            var boss = this.Demons.filter(function (d) { return d.Name === 'Dark'; })[0];
            this.Player.IsActive = false;
            game.context.PlayState.MoveCameraTo(boss.Position, 10)
                .WhenDone(function () {
                game.context.PlayState.DimScreen(false, 1);
            })
                .Then()
                .Delay(1)
                .WhenDone(function () {
                game.context.PlayState.DimScreen(true, 1);
                _this.Player.IsActive = true;
            });
        };
        return Purgatory;
    }(core.Layer));
    game.Purgatory = Purgatory;
    /**
     * Spawn items and boses acorring to context;
     */
    var ContextSpawner = (function () {
        function ContextSpawner(Sheet) {
            this.Sheet = Sheet;
            this.DemonNames = LEVEL_1_DEMONS.concat(LEVEL_2_DEMONS).concat(LEVEL_BOSS);
            this.ItemNames = LEVEL_1_ITEMS.concat(LEVEL_2_ITEMS);
            this.AliveDemons = this.DemonNames.filter(function (name) { return game.context.KilledDemons.indexOf(name) === -1; });
            this.LeftItems = this.ItemNames.filter(function (name) { return game.context.AquiredItems.indexOf(name) === -1; });
            console.log("Context Spawner:");
            console.log("    Alive demons: " + this.AliveDemons);
            console.log("    Left items: " + this.LeftItems);
        }
        ContextSpawner.prototype.SpawnActor = function (slot) {
            var actorName = PURGATORY_LAYOUT[slot];
            if (this.ActorExist(actorName)) {
                switch (actorName) {
                    case 'Red': return new game.ARedDemon(0, 0, this.Sheet);
                    case 'Blue': return new game.ABlueDemon(0, 0, this.Sheet);
                    case 'Green': return new game.AGreenDemon(0, 0, this.Sheet);
                    case 'Purple': return new game.APurpleDemon(0, 0, this.Sheet);
                    case 'Dark': return new game.ADarkDemon(0, 0, this.Sheet);
                    case 'Life': return new game.ALifeBonus(0, 0, this.Sheet);
                    case 'Attack': return new game.AAttackBonus(0, 0, this.Sheet);
                }
            }
            return undefined;
        };
        ContextSpawner.prototype.ActorExist = function (name) {
            return this.AliveDemons.indexOf(name) !== -1 || this.LeftItems.indexOf(name) !== -1;
        };
        return ContextSpawner;
    }());
})(game || (game = {}));
/// <reference path="../Actor.ts" />
var game;
(function (game) {
    var ATooth = (function (_super) {
        __extends(ATooth, _super);
        function ATooth(x, y, Pixels) {
            var _this = this;
            _super.call(this, x, y, Pixels[0].length, Pixels.length);
            this.Pixels = Pixels;
            this.Color = 'white';
            /**
             * Since Position can only be integer we have to use separate,
             * property to store floating values.
             */
            this.FloatPosition = new core.Vector();
            core.Assert(Pixels.length > 0, "Pixels can't be null.");
            this.Position.Clone(this.FloatPosition);
            this.Size.Set(Pixels[0].length, Pixels.length);
            this.Timer.Repeat(0, function () { return _this.FloatPosition.Clone(_this.Position); });
            // this.Anchor.Set(0.5, 0.5);
            this.Cache();
        }
        ATooth.prototype.DrawSelf = function (ctx) {
            ctx.fillStyle = this.Color;
            for (var y = 0; y < this.Pixels.length; ++y) {
                var row = this.Pixels[y];
                for (var x = 0; x < row.length; ++x) {
                    if (row[x] !== 0) {
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        };
        ATooth.prototype.GetBottomRight = function (out) {
            if (out === void 0) { out = new core.Vector(); }
            vec.Add(this.Position, this.Size, out);
            return out;
        };
        ATooth.prototype.Blink = function (time, rate) {
            var _this = this;
            if (time === void 0) { time = 1; }
            if (rate === void 0) { rate = 0.05; }
            var ticks = (time / rate) | 0;
            this.Timer.Repeat(rate, function (n) {
                if (n == ticks) {
                    _this.Visible = true;
                }
                else {
                    _this.Visible = !_this.Visible;
                }
            }, undefined, ticks);
        };
        return ATooth;
    }(game.Actor));
    game.ATooth = ATooth;
    var tooth;
    (function (tooth_1) {
        var TMP1 = new core.Vector();
        var TMP2 = new core.Vector();
        function PixelPerfectCollision(a, b) {
            // So the a is always the samller object.
            if (a.Size.x * a.Size.y > b.Size.x * b.Size.y) {
                var t = a;
                a = b;
                b = t;
            }
            var delta = TMP1;
            vec.Subtract(a.Position, b.Position, delta);
            for (var y = 0; y < a.Size.y; ++y) {
                if (b.Pixels[y + delta.y]) {
                    for (var x = 0; x < a.Size.x; ++x) {
                        var bPixel = b.Pixels[y + delta.y][x + delta.x];
                        if (bPixel != undefined && a.Pixels[y][x] != 0 && bPixel != 0) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        tooth_1.PixelPerfectCollision = PixelPerfectCollision;
        function Collide(a, b) {
            var a_br = a.GetBottomRight(TMP1), a_tl = a.Position;
            var b_br = b.GetBottomRight(TMP2), b_tl = b.Position;
            if (a_tl.x > b_br.x || a_br.x < b_tl.x ||
                a_tl.y > b_br.y || a_br.y < b_tl.y) {
                return false;
            }
            else {
                return PixelPerfectCollision(a, b);
            }
        }
        tooth_1.Collide = Collide;
        tooth_1.player = [
            [0, 0, 0, 1],
            [1, 0, 1, 0],
            [0, 1, 0, 0],
            [1, 0, 1, 0]
        ];
        function gen(width, height) {
            if (height === void 0) { height = Math.floor(width / 2) + 1; }
            core.Assert(width % 2 === 1, "only odd width");
            core.Assert(height > 0);
            core.Assert((height * 2 - 1) >= width);
            var normalizedHeight = Math.floor(width / 2) + 1;
            var tooth = [];
            for (var y = 0; y < normalizedHeight; ++y) {
                var row = [];
                for (var x = 0; x < width / 2 - 1; ++x) {
                    row[x] = ((width / 2 - 1) - x) < y ? 1 : 0;
                }
                row[Math.floor(width / 2)] = 1;
                for (var x = Math.floor(width / 2) + 1, i = 0; x < width; ++x, ++i) {
                    row[x] = row[Math.floor(width / 2) - 1 - i];
                }
                tooth.push(row);
            }
            var finalTooth = [tooth[0]];
            for (var offset = 1;; ++offset) {
                for (var y = 1; y < tooth.length; ++y) {
                    finalTooth.splice(y * offset, 0, tooth[y].slice(0));
                    if (finalTooth.length === height) {
                        return finalTooth;
                    }
                }
            }
        }
        tooth_1.gen = gen;
    })(tooth = game.tooth || (game.tooth = {}));
})(game || (game = {}));
/// <reference path="../Actor.ts" />
var game;
(function (game) {
    var ADemonFace = (function (_super) {
        __extends(ADemonFace, _super);
        function ADemonFace(x, y, frames, sheet) {
            _super.call(this, x, y, 64, 64);
            core.Assert(frames.length == 2);
            var sprites = frames.map(function (frame) { return sheet.GetSprite(frame); });
            sprites.forEach(function (sprite) {
                sprite.SourceRect.Size.Set(64, 64);
                sprite.Size.Set(64, 64);
            });
            this.Animator.AddAnimation('idle', [0], sprites);
            this.Animator.AddAnimation('hurt', [1], sprites);
            this.Animator.Play('idle');
        }
        ADemonFace.prototype.Hurt = function () {
            var _this = this;
            this.Animator.Play('hurt');
            this.Timer.Delay(0.3, function () { return _this.Animator.Play('idle'); });
            // this.Timer.Repeat(0.1, () => this.Visible = !this.Visible, undefined, 2)
        };
        return ADemonFace;
    }(game.AnimatedActor));
    game.ADemonFace = ADemonFace;
})(game || (game = {}));
var core;
(function (core) {
    var RgbColor = (function () {
        function RgbColor(r, g, b, a) {
            if (a === void 0) { a = 1; }
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
            this.r = Math.round(r);
            this.g = Math.round(g);
            this.b = Math.round(b);
        }
        RgbColor.prototype.ToHSV = function () {
            var _a = this, r = _a.r, g = _a.g, b = _a.b, max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, h, s = (max === 0 ? 0 : d / max), v = max / 255;
            switch (max) {
                case min:
                    h = 0;
                    break;
                case r:
                    h = (g - b) + d * (g < b ? 6 : 0);
                    h /= 6 * d;
                    break;
                case g:
                    h = (b - r) + d * 2;
                    h /= 6 * d;
                    break;
                case b:
                    h = (r - g) + d * 4;
                    h /= 6 * d;
                    break;
            }
            return new HsvColor(h, s, v, this.a);
        };
        RgbColor.prototype.toString = function () {
            return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        };
        return RgbColor;
    }());
    core.RgbColor = RgbColor;
    var HsvColor = (function () {
        function HsvColor(h, s, v, a) {
            if (a === void 0) { a = 1; }
            this.h = h;
            this.s = s;
            this.v = v;
            this.a = a;
        }
        HsvColor.prototype.ToRGB = function () {
            var _a = this, h = _a.h, s = _a.s, v = _a.v, i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), r, g, b;
            switch (i % 6) {
                case 0:
                    r = v, g = t, b = p;
                    break;
                case 1:
                    r = q, g = v, b = p;
                    break;
                case 2:
                    r = p, g = v, b = t;
                    break;
                case 3:
                    r = p, g = q, b = v;
                    break;
                case 4:
                    r = t, g = p, b = v;
                    break;
                case 5:
                    r = v, g = p, b = q;
                    break;
            }
            return new RgbColor(r * 255, g * 255, b * 255, this.a);
        };
        HsvColor.prototype.toString = function () {
            return "hsva(" + this.h + ", " + this.s + ", " + this.v + ", " + this.a + ")";
        };
        return HsvColor;
    }());
    core.HsvColor = HsvColor;
})(core || (core = {}));
/// <reference path="Utils.ts" />
var core;
(function (core) {
    var ObservableProperty = (function () {
        function ObservableProperty(Value) {
            this.Value = Value;
            this.OnChange = new core.CallbackSet();
        }
        ObservableProperty.prototype.Get = function () {
            return this.Value;
        };
        ObservableProperty.prototype.Set = function (newValue) {
            var oldValue = this.Value;
            this.Value = newValue;
            this.OnChange.CallAll(newValue, oldValue);
        };
        ObservableProperty.prototype.toString = function () {
            return this.Value.toString();
        };
        return ObservableProperty;
    }());
    core.ObservableProperty = ObservableProperty;
    var ObservableNumber = (function (_super) {
        __extends(ObservableNumber, _super);
        function ObservableNumber() {
            _super.apply(this, arguments);
        }
        ObservableNumber.prototype.Increment = function (value) {
            if (value === void 0) { value = 1; }
            this.Set(this.Value + value);
        };
        return ObservableNumber;
    }(ObservableProperty));
    core.ObservableNumber = ObservableNumber;
})(core || (core = {}));
/// <reference path="actors/ATooth.ts" />
var game;
(function (game) {
    var TeethGenertor = (function () {
        function TeethGenertor(Upper, Lower, Gap) {
            this.Upper = Upper;
            this.Lower = Lower;
            this.Gap = Gap;
            core.Assert(Upper.length === Lower.length);
            this.Lower = Lower.map(function (tooth) { return tooth ? tooth.slice(0) : tooth; });
            this.Upper = Upper.map(function (tooth) { return tooth ? tooth.slice(0) : tooth; });
            this.LastX = this.Gap * (this.Lower.length - 1);
            this.Upper.forEach(function (tooth) {
                if (tooth) {
                    return tooth.reverse();
                }
            });
        }
        TeethGenertor.prototype.SpawnAll = function (upperOffset, lowerOffset) {
            var _this = this;
            var teeth = [];
            this.Upper.forEach(function (tooth, i) {
                if (tooth) {
                    teeth.push(new game.ATooth(upperOffset.x + i * _this.Gap, upperOffset.y, tooth));
                }
            });
            this.Lower.forEach(function (tooth, i) {
                if (tooth) {
                    var t = new game.ATooth(lowerOffset.x + i * _this.Gap, lowerOffset.y, tooth);
                    t.FloatPosition.y -= t.Size.y;
                    teeth.push(t);
                }
            });
            return teeth;
        };
        return TeethGenertor;
    }());
    game.TeethGenertor = TeethGenertor;
    var _ = undefined;
    var a = game.tooth.gen(15, 25);
    var A = game.tooth.gen(15, 35);
    var b = game.tooth.gen(19, 25);
    var B = game.tooth.gen(19, 35);
    var n = game.tooth.gen(19, 16);
    game.theeth = {
        demon1: {
            upper: [a, _, b, _, n, _],
            lower: [_, B, _, A, n, A],
            gap: 30
        }
    };
})(game || (game = {}));
/// <reference path="../core/DisplayObject.ts" />
/// <reference path="IStyle.ts" />
var gfx;
(function (gfx) {
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(x, y, radious, Style) {
            if (Style === void 0) { Style = { fillStyle: 'red' }; }
            _super.call(this, x, y, radious * 2, radious * 2);
            this.Style = Style;
            this.Angle = {
                Start: 0,
                Stop: Math.PI * 2
            };
            if (radious <= 0)
                throw Error();
        }
        Circle.prototype.DrawSelf = function (ctx) {
            var radious = this.Size.x / 2;
            ctx.beginPath();
            ctx.arc(radious, radious, radious - 1, this.Angle.Start, this.Angle.Stop);
            if (this.Style.compositeOperation) {
                ctx.globalCompositeOperation = this.Style.compositeOperation;
            }
            if (this.Style.lineWidth) {
                ctx.lineWidth = this.Style.lineWidth;
            }
            if (this.Style.fillStyle) {
                ctx.fillStyle = this.Style.fillStyle;
                ctx.fill();
            }
            if (this.Style.strokeStyle) {
                ctx.strokeStyle = this.Style.strokeStyle;
                ctx.stroke();
            }
        };
        return Circle;
    }(core.DisplayObject));
    gfx.Circle = Circle;
})(gfx || (gfx = {}));
/// <reference path="../core/DisplayObject.ts" />
/// <reference path="actors/ATooth.ts" />
/// <reference path="actors/ADemonFace.ts" />
/// <reference path="../core/Color.ts" />
/// <reference path="../core/ObservableProperty.ts" />
/// <reference path="TeethGenerator.ts" />
/// <reference path="../gfx/Circle.ts" />
var game;
(function (game) {
    var FLIP_POWER = 40;
    var QUANTIZE_POS = function (pos) { return pos.Set(Math.floor(pos.x), Math.floor(pos.y)); };
    var FightMode = (function (_super) {
        __extends(FightMode, _super);
        function FightMode(x, y, generator, DemonName) {
            var _this = this;
            _super.call(this, x, y, 64, 64);
            this.DemonName = DemonName;
            this.Mouth = new core.Layer(5, 15, 54, 45);
            this.Face = new core.Layer(0, 0, 64, 64);
            // Area = new gfx.Rectangle(5, 15, 54, 45, {strokeStyle: 'red', lineWidth: 0.5});
            this.Teeth = new core.Layer();
            this.TeethVelocity = new core.Vector(-10, 0);
            this.Player = new game.ATooth(5, 20, game.tooth.player);
            this.PlayerVelocity = new core.Vector(0, 0);
            // PlayerHealthBar = new HealthBar(6, 1, 20, 5, "H", new core.RgbColor(255, 0, 0, 0.5));
            this.CanFlap = true;
            this.Gravity = new core.Vector(0, 80);
            this.DemonHealthBar = new HealthBar(5, 2, 54, 2, new core.RgbColor(174, 50, 50, 1));
            // Marker = new gfx.Rectangle(0, 0, 4, 4, {fillStyle: "rgba(255, 0, 0, 0.5)"});
            this.TimeScale = 1;
            this.Timers = new core.TimersManager();
            this.Tween = new core.TweenManager();
            this.BloodTween = new core.TweenManager();
            this.BloodParticles = new core.Layer();
            var ss = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            this.DemonFace = new game.ADemonFace(0, 0, game.assets.FIGHT_DEMON_MOUTH.RED, ss);
            this.DemonHealthBarBg = ss.GetSprite(game.assets.FIGHT_DEMON_HEALTHBAR);
            this.DemonHealthBarBg.SourceRect.Size.Set(64, 7);
            this.DemonHealthBarBg.Size.Set(64, 7);
            // this.Player.EnableSubpixelMovement = true;
            generator
                .SpawnAll(new core.Vector(this.Size.x / 2, 0), new core.Vector(this.Size.x / 2, 45))
                .forEach(function (tooth) {
                tooth.Visible = tooth.Position.x < _this.Mouth.Size.x + 10;
                _this.Teeth.AddChild(tooth);
            });
            this.ToothRestartX = generator.LastX;
            this.Mouth.AddChild(this.Teeth, this.Player, this.BloodParticles);
            // this.Mouth.AddChild(this.Marker);
            this.Face.AddChild(this.DemonFace);
            if (!game.context.PlayerHas('Light')) {
                this.ActiveLightCone(ss);
            }
            this.SetupBloodParticles(20);
            this.BloodParticles.Visible = false;
            this.DemonHealthBar.Progress.OnChange.Add(function (value) {
                if (value <= 0) {
                    _this.DemonSlayed();
                }
            });
            this.TimeScale = 0;
            game.context.PlayState.DimScreen(true, 2)
                .WhenDone(function () { return _this.TimeScale = 1; });
        }
        FightMode.prototype.Update = function (timeDelta) {
            timeDelta *= this.TimeScale;
            // Debug code
            // this.Player.Position.Clone(this.Marker.Position);
            // this.Marker.Visible = false;
            this.Timers.Update(timeDelta);
            this.BloodTween.Update(timeDelta);
            this.Tween.Update(timeDelta);
            this.DemonFace.Update(timeDelta);
            var thereWasCollision = this.CheckCollision();
            this.IntegrateVelocity(timeDelta);
            if (!thereWasCollision) {
                if (this.Player.FloatPosition.y < 0) {
                    this.DemonTakeDamage(true);
                }
                else if (this.Player.FloatPosition.y > this.Mouth.Size.y - this.Player.Size.y) {
                    this.DemonTakeDamage(false);
                }
            }
            // clamp Position
            this.Player.FloatPosition.y = core.math.Clamp(this.Player.FloatPosition.y, 0, this.Mouth.Size.y - this.Player.Size.y);
            this.Player.Update(timeDelta);
        };
        FightMode.prototype.DrawSelf = function (ctx) {
            this.Mouth.Draw(ctx);
            this.Face.Draw(ctx);
            this.DemonHealthBarBg.Draw(ctx);
            this.DemonHealthBar.Draw(ctx);
        };
        FightMode.prototype.Flap = function () {
            if (this.CanFlap && this.Player.IsActive) {
                this.PlayerVelocity.y = -FLIP_POWER;
                this.CanFlap = false;
            }
        };
        /**
         * Opposite for flap.
         */
        FightMode.prototype.Flip = function () {
            this.CanFlap = true;
        };
        FightMode.prototype.DemonTakeDamage = function (upperLip) {
            var _this = this;
            if (!this.Player.IsActive)
                return;
            this.DemonFace.Hurt();
            this.PlayerVelocity.y = FLIP_POWER * (upperLip ? 0.45 : -1);
            game.context.PlayState.ShakeScreen(0.3, 3);
            var t = this.Timers.Repeat(0, function () { return _this.CanFlap = false; });
            this.Timers.Delay(0.2, function () { return t.Stop(); });
            var bloodPos = new core.Vector();
            if (upperLip) {
                this.Player.Position.Clone(bloodPos);
            }
            else {
                vec.Add(this.Player.Position, this.Player.Size, bloodPos);
            }
            this.EmitBloodParicles(bloodPos, upperLip);
            this.DemonHealthBar.Progress.Increment(-0.05);
        };
        FightMode.prototype.PlayerTakeDamage = function () {
            // this could happen if we fall onto another tooth while falling.
            if (!this.Player.IsActive)
                return;
            this.Player.IsActive = false;
            this.TeethVelocity.Set(0, 0);
            this.Gravity.Set(0, 0);
            this.PlayerVelocity.Set(0, 0);
            var delay = 2;
            var fade = 2;
            this.Tween.New(this.Mouth)
                .Delay(delay)
                .Then()
                .To({ Alpha: 0 }, fade * 0.75)
                .Start();
            this.Tween.New(this.Face)
                .Delay(delay)
                .Then()
                .To({ Alpha: 0 }, fade)
                .Start()
                .WhenDone(function () {
                game.context.LifesLeft -= 1;
                GAME.Play('you-died');
            });
        };
        FightMode.prototype.DemonSlayed = function () {
            var _this = this;
            if (!this.Player.IsActive)
                return;
            game.context.KilledDemons.push(this.DemonName);
            this.Player.IsActive = false;
            this.TeethVelocity.Set(0, 0);
            this.Gravity.Set(0, 0);
            this.PlayerVelocity.Set(0, 0);
            var delay = 2;
            var fade = 2;
            this.Tween.New(this.Mouth)
                .Delay(delay)
                .Then()
                .To({ Alpha: 0 }, fade * 0.75)
                .Parallel(this.Mouth.Position, function (t) { return t
                .To({ y: _this.Mouth.Position.y + 50 }, fade, core.easing.CubicIn)
                .OnUpdate(QUANTIZE_POS); })
                .Start();
            this.Tween.New(this.Face)
                .Delay(delay)
                .WhenDone(function () { return game.context.PlayState.ShakeScreen(fade, 4); })
                .Then()
                .To({ Alpha: 0 }, fade)
                .Parallel(this.Face.Position, function (t) { return t
                .To({ y: _this.Face.Position.y + 50 }, fade, core.easing.CubicIn)
                .OnUpdate(QUANTIZE_POS); })
                .Start()
                .WhenDone(function () {
                GAME.Play('demon-slayed');
            });
        };
        FightMode.prototype.CheckCollision = function () {
            for (var _i = 0, _a = this.Teeth.Children; _i < _a.length; _i++) {
                var tooth_2 = _a[_i];
                if (game.tooth.Collide(this.Player, tooth_2)) {
                    if (tooth_2.IsActive) {
                        tooth_2.IsActive = false;
                        tooth_2.Blink(2, 0.1);
                        this.PlayerTakeDamage();
                    }
                    // this.Marker.Visible = true;
                    return true;
                }
            }
            return false;
        };
        FightMode.prototype.IntegrateVelocity = function (timeDelta) {
            var delta = new core.Vector();
            vec.Scale(this.TeethVelocity, timeDelta, delta);
            for (var _i = 0, _a = this.Teeth.Children; _i < _a.length; _i++) {
                var tooth_3 = _a[_i];
                vec.Add(tooth_3.FloatPosition, delta, tooth_3.FloatPosition);
                tooth_3.Update(timeDelta);
                if (tooth_3.Position.x < -20) {
                    // Restarth tooth
                    tooth_3.FloatPosition.x = this.ToothRestartX;
                    tooth_3.IsActive = true;
                    tooth_3.Visible = false;
                }
                else if (tooth_3.Position.x >= this.Mouth.Size.x && tooth_3.Position.x < this.Mouth.Size.x + 10) {
                    // Show tooth
                    tooth_3.Visible = true;
                }
            }
            // TODO blinking tooths can sometimes be rendered out of screen :/
            // console.log("visible tooths: " + this.Teeth.Children.map(t => t.Visible ? 1 : 0).reduce((p, c) => p + c, 0));
            // gravity update
            vec.Scale(this.Gravity, timeDelta, delta);
            vec.Add(this.PlayerVelocity, delta, this.PlayerVelocity);
            // velocity update
            vec.Scale(this.PlayerVelocity, timeDelta, delta);
            vec.Add(this.Player.FloatPosition, delta, this.Player.FloatPosition);
        };
        FightMode.prototype.SetupBloodParticles = function (max) {
            for (var i = 0; i < max; ++i) {
                this.BloodParticles.AddChild(new gfx.Rectangle(0, 0, 1, 1, { fillStyle: 'rgba(255, 0, 0, 0.5)' }));
            }
        };
        FightMode.prototype.EmitBloodParicles = function (start, fromTop) {
            var _this = this;
            this.BloodTween.StopAll(false);
            this.BloodParticles.Visible = true;
            var FALL_TIME = 1;
            for (var _i = 0, _a = this.BloodParticles.Children; _i < _a.length; _i++) {
                var particle = _a[_i];
                particle.Position.Set(0, 0);
                particle.Alpha = 1;
                var y = core.Random(5, 10);
                var fall = FALL_TIME * (y / 10);
                this.BloodTween.New(particle.Position)
                    .To({ y: fromTop ? y : -y, x: core.Random(-5, 5) }, fall / 2, core.easing.CubicOut)
                    .OnUpdate(QUANTIZE_POS)
                    .Then()
                    .OnUpdate(QUANTIZE_POS)
                    .To({ y: 0 }, fall / 2, core.easing.CubicIn)
                    .Start();
            }
            var d = FALL_TIME * this.TeethVelocity.x * 1.5;
            this.BloodParticles.Position.Set(start.x, start.y);
            this.BloodTween.New(this.BloodParticles.Position)
                .OnUpdate(QUANTIZE_POS)
                .To({ x: start.x + d }, FALL_TIME)
                .Start()
                .WhenDone(function () { return _this.BloodParticles.Visible = false; });
        };
        FightMode.prototype.ActiveLightCone = function (ss) {
            var _this = this;
            var shape = ss.GetSprite(game.assets.FIGHT_LIGHT_CONE);
            shape.Size.Set(40, 40);
            shape.SourceRect.Size.Set(40, 40);
            this.LightCone = new LightCone(0, 0, shape);
            this.LightCone.Position.x = this.Player.Position.x - this.LightCone.Size.x / 2 + 2;
            this.Timers.Repeat(0, function () {
                _this.LightCone.Position.y = _this.Player.Position.y - _this.LightCone.Size.x / 2 + 2;
            });
            this.Mouth.AddChild(this.LightCone);
        };
        return FightMode;
    }(core.DisplayObject));
    game.FightMode = FightMode;
    var HealthBar = (function (_super) {
        __extends(HealthBar, _super);
        function HealthBar(x, y, width, height, color) {
            var _this = this;
            _super.call(this, x, y, width, height);
            this.Progress = new core.ObservableNumber(1);
            this.Fill = new gfx.Rectangle(0, 0, width, height, { fillStyle: color.toString() });
            // color.a /= 2;
            // this.Background = new gfx.Rectangle(0, 0, width, height, {fillStyle: color.toString()});
            this.Progress.OnChange.Add(function (value) {
                value = core.math.Clamp(value, 0, 1);
                _this.Fill.Size.x = value * width;
            });
        }
        HealthBar.prototype.DrawSelf = function (ctx) {
            // this.Background.Draw(ctx);
            this.Fill.Draw(ctx);
        };
        return HealthBar;
    }(core.DisplayObject));
    var LightCone = (function (_super) {
        __extends(LightCone, _super);
        function LightCone(x, y, Shape) {
            _super.call(this, x, y, Shape.Size.x, Shape.Size.y);
            this.Shape = Shape;
        }
        LightCone.prototype.DrawSelf = function (ctx) {
            ctx.globalCompositeOperation = 'source-in';
            this.Shape.Draw(ctx);
        };
        return LightCone;
    }(core.DisplayObject));
})(game || (game = {}));
/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />
var state;
(function (state) {
    var PLAYER_SPEED = 20;
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState() {
            _super.apply(this, arguments);
        }
        /**
         * Called once before first update
         */
        PlayState.prototype.Start = function () {
            // simple key handing mechanism, this is not part of this framework
            // its quick fix for this demo.
            this.IsKeyDown = [];
            this.CameraTweens = new core.TweenManager();
            // set game size befor Start, this is important since is sets
            // native game resolution. OnResize doesn't change game resolution, it
            // only scales the game.
            // Note to self: This could be done better?
            this.DefaultSize.Set(64, 64);
            // this.DefaultSize.Set(128, 128);
            // this.DefaultSize.Set(256, 256);
            this.ScreenCenter = new core.Vector(this.DefaultSize.x / 2 - 24 / 2, this.DefaultSize.y / 2 - 24 / 2);
            _super.prototype.Start.call(this);
            game.context.PlayState = this;
            // setup controlls
            // this thing is unused here in this demo, since I think
            // is still need some work, I will not comment on this.
            this.InputController = new core.GenericInputController();
            // this is important, it registers handler for keyboard input.
            // should be handled by inputcontroller, but as i said before
            // it need some more work.
            this.ListenForKeyboard();
            // setup fps metter
            // this.ShowFps();
            this.FPSText.Position.Set(0, 0);
            // fit window
            this.OnResize();
            // start game.
            // this.RestartPurgatory();
            this.BeginFigthMode('Red');
        };
        PlayState.prototype.OnKeyUp = function (key) {
            this.IsKeyDown[key] = false;
        };
        PlayState.prototype.OnKeyDown = function (key) {
            this.IsKeyDown[key] = true;
        };
        /**
         * Called once per frame.
         *
         * @param timeDelta time in SECONDS since last frame.
         */
        PlayState.prototype.Update = function (timeDelta) {
            _super.prototype.Update.call(this, timeDelta);
            this.CameraTweens.Update(timeDelta);
            if (this.FightMode) {
                if (this.IsKeyDown[38 /* UP */]) {
                    this.FightMode.Flap();
                }
                else {
                    this.FightMode.Flip();
                }
                this.FightMode.Update(timeDelta);
            }
            if (this.Purgatory) {
                if (this.IsKeyDown[37 /* LEFT */])
                    this.Purgatory.MovePlayer(0 /* LEFT */);
                else if (this.IsKeyDown[38 /* UP */])
                    this.Purgatory.MovePlayer(2 /* UP */);
                else if (this.IsKeyDown[39 /* RIGHT */])
                    this.Purgatory.MovePlayer(1 /* RIGHT */);
                this.Purgatory.Update(timeDelta);
                if (!this.CameraTweens.TweenPlaying()) {
                    this.CenterCamera();
                }
            }
        };
        PlayState.prototype.OnResize = function () {
            _super.prototype.OnResize.call(this);
            audio.manager.Volume = 0;
        };
        PlayState.prototype.BeginFigthMode = function (demonName) {
            var gen = new game.TeethGenertor(game.theeth.demon1.upper, game.theeth.demon1.lower, game.theeth.demon1.gap);
            this.FightMode = new game.FightMode(0, 0, gen, demonName);
            this.Stage.AddChild(this.FightMode);
            if (this.Purgatory) {
                this.Purgatory.RemoveFromParent();
                this.Purgatory = null;
            }
        };
        PlayState.prototype.RestartPurgatory = function () {
            if (this.Purgatory)
                this.Purgatory.RemoveFromParent();
            this.Stage.Alpha = 1;
            this.DimScreen(true);
            this.Purgatory = new game.Purgatory(0.5, 0.5);
            this.Stage.AddChild(this.Purgatory);
        };
        PlayState.prototype.ShakeScreen = function (time, amplitude) {
            if (amplitude === void 0) { amplitude = 5; }
            return this.Tweens.New(this.Stage.Position)
                .OnUpdate(function (position, progress) {
                progress = progress > 0.5 ? 2 - progress * 2 : progress * 2;
                position.Set((core.Random(-amplitude, amplitude) * progress) | 0, (core.Random(-amplitude, amplitude) * progress) | 0);
            })
                .Delay(time)
                .Then()
                .To({ x: 0, y: 0 }, 0.01)
                .Start();
        };
        PlayState.prototype.BlinkScreen = function (time, rate) {
            if (time === void 0) { time = 1; }
            if (rate === void 0) { rate = 0.1; }
            var rect = new gfx.Rectangle(0, 0, this.Stage.Size.x, this.Stage.Size.y, {
                fillStyle: 'white', compositeOperation: 'difference'
            });
            this.Stage.AddChild(rect);
            var callLimit = (time / rate) | 0;
            this.Timers.Repeat(rate, function (count) {
                if (count == callLimit)
                    rect.RemoveFromParent();
                else
                    rect.Visible = !rect.Visible;
            }, undefined, callLimit);
        };
        PlayState.prototype.DimScreen = function (reverse, time) {
            if (reverse === void 0) { reverse = false; }
            if (time === void 0) { time = 2; }
            if (reverse) {
                this.Stage.Alpha = 1 - this.Stage.Alpha;
            }
            return this.Tweens.New(this.Stage)
                .To({ Alpha: reverse ? 1 : 0 }, time)
                .Start();
        };
        PlayState.prototype.MoveCameraTo = function (target, duration) {
            if (duration === void 0) { duration = 1; }
            target = target.Clone();
            core.vector.Subtract(this.ScreenCenter, target, target);
            return this.CameraTweens.New(this.Purgatory.Position)
                .To({ x: target.x, y: target.y }, duration, core.easing.SinusoidalInOut)
                .Start();
        };
        PlayState.prototype.CenterCamera = function () {
            // center camera on target
            core.vector.Subtract(this.ScreenCenter, this.Purgatory.Player.Position, this.Purgatory.Position);
            // pan camera to map boundary
            //
            // TURNED OFF - can be removed after solving problem of seeing two paths (demon and item).
            //
            // core.vector.Min(new core.Vector(0, 0), this.Purgatory.Position, this.Purgatory.Position);
            // let max = new core.Vector();
            // core.vector.Subtract(this.DefaultSize, this.Purgatory.Size, max);
            // core.vector.Max(max, this.Purgatory.Position, this.Purgatory.Position);
        };
        return PlayState;
    }(state.AbstractState));
    state.PlayState = PlayState;
})(state || (state = {}));
/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />
var state;
(function (state) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            _super.apply(this, arguments);
        }
        /**
         * Called once before first update
         */
        Menu.prototype.Start = function () {
            this.IsKeyDown = [];
            this.DefaultSize.Set(64, 64);
            _super.prototype.Start.call(this);
            /**
             * RESET CONTEXT
             */
            game.context.Reset();
            var ss = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            /**
             * rycerz spi przy ognisku !!!!
             */
            var t1 = new gfx.AAText(17, 45, "PRESS UP");
            var t2 = new gfx.AAText(17, 51, "TO START");
            t1.SetSize(5);
            t2.SetSize(5);
            this.Stage.AddChild(t1, t2);
            // this.Stage.Alpha = 0;
            this.DimScreen(true, 2);
            this.InputController = new core.GenericInputController();
            this.ListenForKeyboard();
            this.OnResize();
        };
        Menu.prototype.OnKeyUp = function (key) {
            this.IsKeyDown[key] = false;
        };
        Menu.prototype.OnKeyDown = function (key) {
            this.Game.Play('play');
        };
        Menu.prototype.DimScreen = function (reverse, time) {
            if (reverse === void 0) { reverse = false; }
            if (time === void 0) { time = 2; }
            if (reverse) {
                this.Stage.Alpha = 1 - this.Stage.Alpha;
            }
            return this.Tweens.New(this.Stage)
                .To({ Alpha: reverse ? 1 : 0 }, time)
                .Start();
        };
        return Menu;
    }(state.AbstractState));
    state.Menu = Menu;
})(state || (state = {}));
/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../gfx/Sprite.ts" />
var state;
(function (state) {
    var LoadingState = (function (_super) {
        __extends(LoadingState, _super);
        function LoadingState() {
            _super.apply(this, arguments);
        }
        LoadingState.prototype.Start = function () {
            var _this = this;
            this.DefaultSize.Set(64, 64);
            _super.prototype.Start.call(this);
            var txt = new gfx.AAText(15, 30, "LOADING");
            txt.SetSize(5);
            var dots = "";
            this.Timers.Repeat(0.5, function () {
                if (dots.length === 3) {
                    dots = "";
                }
                else {
                    dots += ".";
                }
                txt.SetText("LOADING " + dots);
            });
            this.Stage.AddChild(txt);
            gfx.Sprite.Load(['spritesheet', 'assets/images/spritesheet.png']).then(function () {
                _this.Game.Play('play');
                // this.Game.Play('epilog');
            });
            this.OnResize();
        };
        return LoadingState;
    }(state.AbstractState));
    state.LoadingState = LoadingState;
})(state || (state = {}));
/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />
var state;
(function (state) {
    var YouDiedState = (function (_super) {
        __extends(YouDiedState, _super);
        function YouDiedState() {
            _super.apply(this, arguments);
        }
        /**
         * Called once before first update
         */
        YouDiedState.prototype.Start = function () {
            var _this = this;
            this.IsKeyDown = [];
            this.DefaultSize.Set(64, 64);
            _super.prototype.Start.call(this);
            var ss = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            var txt = new gfx.AAText(17, 27, "YOU DIED");
            txt.SetSize(5);
            var _loop_3 = function(i) {
                var frame = ss.GetSprite(game.assets.HEART_FRAME);
                var fill = ss.GetSprite(game.assets.HEART_FILL);
                frame.Position.Set(14 + i * 10, 35);
                fill.Position.Set(14 + i * 10, 35);
                this_3.Stage.AddChild(frame);
                if (i <= game.context.LifesLeft) {
                    this_3.Stage.AddChild(fill);
                }
                if (i == game.context.LifesLeft) {
                    this_3.Timers.Repeat(0.3, function () { return fill.Visible = !fill.Visible; }, undefined, 11);
                }
            };
            var this_3 = this;
            for (var i = 0; i < 4; ++i) {
                _loop_3(i);
            }
            this.Stage.AddChild(txt);
            // this.Stage.Alpha = 0;
            this.DimScreen(true, 2);
            this.Timers.Delay(4, function () { return _this.OnKeyDown(38 /* UP */); });
            this.InputController = new core.GenericInputController();
            this.ListenForKeyboard();
            this.OnResize();
        };
        YouDiedState.prototype.OnKeyUp = function (key) {
            this.IsKeyDown[key] = false;
        };
        YouDiedState.prototype.OnKeyDown = function (key) {
            if (game.context.LifesLeft > 0) {
                this.Game.Play('play');
            }
            else {
                this.Game.Play('menu');
            }
        };
        YouDiedState.prototype.DimScreen = function (reverse, time) {
            if (reverse === void 0) { reverse = false; }
            if (time === void 0) { time = 2; }
            if (reverse) {
                this.Stage.Alpha = 1 - this.Stage.Alpha;
            }
            return this.Tweens.New(this.Stage)
                .To({ Alpha: reverse ? 1 : 0 }, time)
                .Start();
        };
        return YouDiedState;
    }(state.AbstractState));
    state.YouDiedState = YouDiedState;
})(state || (state = {}));
/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />
var state;
(function (state) {
    var DemonSlayedState = (function (_super) {
        __extends(DemonSlayedState, _super);
        function DemonSlayedState() {
            _super.apply(this, arguments);
        }
        DemonSlayedState.prototype.Start = function () {
            var _this = this;
            this.DefaultSize.Set(64, 64);
            _super.prototype.Start.call(this);
            var ss = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            var txt = new gfx.AAText(9, 27, "DEMON SLAYED");
            txt.SetSize(5);
            for (var i = 0; i < 4; ++i) {
                var frame = ss.GetSprite(game.assets.HEART_FRAME);
                var fill = ss.GetSprite(game.assets.HEART_FILL);
                frame.Position.Set(14 + i * 10, 35);
                fill.Position.Set(14 + i * 10, 35);
                this.Stage.AddChild(frame);
                if (i < game.context.LifesLeft) {
                    this.Stage.AddChild(fill);
                }
            }
            this.Stage.AddChild(txt);
            // this.Stage.Alpha = 0;
            this.DimScreen(true, 2);
            this.Timers.Delay(4, function () { return _this.OnKeyDown(38 /* UP */); });
            this.InputController = new core.GenericInputController();
            this.ListenForKeyboard();
            this.OnResize();
        };
        DemonSlayedState.prototype.OnKeyDown = function (key) {
            if (game.context.AllDemonsKilled()) {
                this.Game.Play('epilog');
            }
            else {
                this.Game.Play('play');
            }
        };
        return DemonSlayedState;
    }(state.AbstractState));
    state.DemonSlayedState = DemonSlayedState;
})(state || (state = {}));
/// <reference path="AbstractState.ts" />
/// <reference path="../gfx/Text.ts" />
/// <reference path="../game/Purgatory.ts" />
/// <reference path="../game/Context.ts" />
/// <reference path="../game/FightMode.ts" />
var state;
(function (state) {
    var EpilogState = (function (_super) {
        __extends(EpilogState, _super);
        function EpilogState() {
            _super.apply(this, arguments);
        }
        EpilogState.prototype.Start = function () {
            var _this = this;
            this.DefaultSize.Set(64, 64);
            _super.prototype.Start.call(this);
            var ss = new gfx.SpriteSheet('spritesheet', new core.Vector(24, 24));
            var part1;
            ["THEY", "ALL", "GONE", "NOW"].forEach(function (msg, i) {
                var txt = new gfx.AAText(32, 32, msg);
                txt.Anchor.Set(.5, .5);
                txt.SetSize(5);
                txt.Alpha = 0;
                _this.Stage.AddChild(txt);
                part1 = _this.Tweens.New(txt)
                    .Delay(1 + i * 2)
                    .Then()
                    .To({ Alpha: 1 })
                    .Then()
                    .To({ Alpha: 0 })
                    .WhenDone(function () { return txt.RemoveFromParent(); })
                    .Start();
            });
            part1.WhenDone(function () {
                var txt = new gfx.AAText(32, 32, "WAKE UP!");
                txt.Anchor.Set(.5, .5);
                txt.SetSize(5);
                txt.Alpha = 0;
                _this.Stage.AddChild(txt);
                _this.Tweens.New(txt)
                    .Then()
                    .To({ Alpha: 1 })
                    .WhenDone(function () { return _this.ShakeScreen(0.5); })
                    .Then()
                    .Delay(1)
                    .WhenDone(function () {
                    txt.Scale.Set(2, 2);
                    _this.ShakeScreen(0.5);
                })
                    .Then()
                    .Delay(1)
                    .WhenDone(function () { return txt.RemoveFromParent(); })
                    .Start();
            });
            var fin = new core.Layer(0, 74);
            [
                "THANK YOU",
                "FOR PLAYING",
                "",
                "FOR MORE NEWS",
                "FOLLOW ME ON",
                "TWITTER",
                "KAKUS_DEV"
            ].forEach(function (line, i, arr) {
                var t = new gfx.AAText(32, i * 7, line);
                t.SetSize(5);
                t.Anchor.Set(.5, .5);
                if (i == arr.length - 1) {
                    t.SetColor('#55acee');
                }
                fin.AddChild(t);
            });
            this.Timers.Delay(15, function () {
                _this.Stage.AddChild(fin);
                _this.Tweens.New(fin.Position)
                    .To({ y: 12 }, 5)
                    .Start();
            });
            // this.Stage.Alpha = 0;
            this.DimScreen(true, 2);
            this.InputController = new core.GenericInputController();
            this.ListenForKeyboard();
            this.OnResize();
        };
        EpilogState.prototype.OnKeyDown = function (key) {
            this.Game.Play('menu');
        };
        return EpilogState;
    }(state.AbstractState));
    state.EpilogState = EpilogState;
})(state || (state = {}));
/// <reference path="core/Game.ts" />
/// <reference path="state/SplashScreen.ts" />
/// <reference path="state/PlayState.ts" />
/// <reference path="state/Menu.ts" />
/// <reference path="state/Loading.ts" />
/// <reference path="state/YouDiedState.ts" />
/// <reference path="state/DemonSlayedState.ts" />
/// <reference path="state/EpilogState.ts" />
var GAME = new core.Game('canvas');
GAME.AddState('splash', new state.SplashScreen());
GAME.AddState('loading', new state.LoadingState());
GAME.AddState('menu', new state.Menu());
GAME.AddState('play', new state.PlayState());
GAME.AddState('you-died', new state.YouDiedState());
GAME.AddState('demon-slayed', new state.DemonSlayedState());
GAME.AddState('epilog', new state.EpilogState());
GAME.Play('loading');
GAME.Start();
