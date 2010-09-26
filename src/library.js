var Library = {
  // stdio.h

  printf: function() {
    __print__(Pointer_stringify(__formatString.apply(null, arguments)));
  },

  puts: function(p) {
    __print__(Pointer_stringify(p) + '\n');
  },

  putchar: function(p) {
    __print__(String.fromCharCode(p));
  },
  _ZNSo3putEc: 'putchar',

  _ZNSo5flushEv: function() {
    __print__('\n');
  },

  // ?

  vsnprintf: function(dst, num, src, ptr) {
    var args = Array_copy(ptr+1, HEAP[ptr]); // # of args in in first place
    var text = __formatString.apply(null, [src].concat(args));
    for (var i = 0; i < num; i++) {
      HEAP[dst+i] = HEAP[text+i];
      if (HEAP[dst+i] == 0) break;
    }
  },

  atexit: function(func) {
    __ATEXIT__.push(func);
  },
  __cxa_atexit: 'atexit',

  // string.h

  strlen: function(p) {
    var q = p;
    while (HEAP[q] != 0) q++;
    return q - p;
  },

  strspn: function(pstr, pset) {
    var str = String_copy(pstr, true);
    var set = String_copy(pset);
    var i = 0;
    while (set.indexOf(str[i]) != -1) i++; // Must halt, as 0 is in str but not set
    return i;
  },

  strcspn: function(pstr, pset) {
    var str = String_copy(pstr, true);
    var set = String_copy(pset, true);
    var i = 0;
    while (set.indexOf(str[i]) == -1) i++; // Must halt, as 0 is in both
    return i;
  },

  strcpy: function(pdest, psrc) {
    var i = 0;
    do {
      HEAP[pdest+i] = HEAP[psrc+i];
      i ++;
    } while (HEAP[psrc+i-1] != 0);
  },

  strncpy: function(pdest, psrc, num) {
    var padding = false;
    for (var i = 0; i < num; i++) {
      HEAP[pdest+i] = padding ? 0 : HEAP[psrc+i];
      padding = padding || HEAP[psrc+i] == 0;
    }
  },

  strlen: function(ptr) {
    var i = 0;
    while (HEAP[ptr+i] != 0) i++;
    return i;
  },

  strcat: function(pdest, psrc) {
    var len = Pointer_stringify(pdest).length; // TODO: use strlen, but need dependencies system
    var i = 0;
    do {
      HEAP[pdest+len+i] = HEAP[psrc+i];
      i ++;
    } while (HEAP[psrc+i-1] != 0);
  },

  strtol: function(ptr) {
    // XXX: We ignore the other two params!
    return parseInt(Pointer_stringify(ptr));
  },

  strcmp: function(px, py) {
    var i = 0;
    while (true) {
      var x = HEAP[px+i];
      var y = HEAP[py+i];
      if (x == y && x == 0) return 0;
      if (x == 0) return -1;
      if (y == 0) return 1;
      if (x == y) {
        i ++;
        continue;
      } else {
        return x > y ? 1 : -1;
      }
    }
  },

  __assert_fail: function(condition, file, line) {
    throw 'Assertion failed: ' + Pointer_stringify(condition);//JSON.stringify(arguments)//condition;
  },

  // Threading stuff LLVM adds sometimes
  __cxa_guard_acquire: function() {
    return 0;
  },
  __cxa_guard_release: function() {
    return 0;
  },

  llvm_memset_i32: function(ptr, value, num) {
    for (var i = 0; i < num; i++) {
      HEAP[ptr+i] = value;
    }
  },

  isdigit: function(chr) {
    return chr >= '0'.charCodeAt(0) && chr <= '9'.charCodeAt(0);
  },

  // iostream
  _ZNSt8ios_base4InitC1Ev: function() {
    // need valid 'file descriptors'
    __ZSt4cout = 1;
    __ZSt4cerr = 2;
  },
  _ZNSt8ios_base4InitD1Ev: '_ZNSt8ios_base4InitC1Ev',
  _ZSt4endlIcSt11char_traitsIcEERSt13basic_ostreamIT_T0_ES6_: 0, // endl
  _ZNSolsEi: function(stream, data) {
    __print__(data);
  },
  _ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc: function(stream, data) {
    __print__(Pointer_stringify(data));
  },
  _ZNSolsEd: function(stream, data) {
    __print__('\n');
  },
  _ZNSolsEPFRSoS_E: function(stream, data) {
    __print__('\n');
  },
  _ZSt16__ostream_insertIcSt11char_traitsIcEERSt13basic_ostreamIT_T0_ES6_PKS3_i: function(stream, data, call_) {
    __print__(Pointer_stringify(data));
  },

  // math.h
  cos: function(x) { return Math.cos(x) },
  sin: function(x) { return Math.sin(x) },
  sqrt: function(x) { return Math.sqrt(x) },
  llvm_sqrt_f64: 'sqrt',
};
