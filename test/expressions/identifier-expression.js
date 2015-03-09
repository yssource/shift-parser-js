/**
 * Copyright 2014 Shape Security, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var testParse = require("../assertions").testParse;
var testParseFailure = require("../assertions").testParseFailure;
var expr = require("../helpers").expr;
var stmt = require("../helpers").stmt;

suite("Parser", function () {
  suite("identifier expression", function () {

    testParse("x", expr,
      { type: "IdentifierExpression", name: "x" }
    );

    testParse("x;", expr,
      { type: "IdentifierExpression", name: "x" }
    );

  });

  suite("let used as identifier expression", function () {

    testParse("let", expr,
      { type: "IdentifierExpression", name: "let" }
    );

    testParse("let()", expr,
      { type: "CallExpression", callee: { type: "IdentifierExpression", name: "let" }, arguments: [] }
    );

    testParse("(let[let])", expr,
      { type: "ComputedMemberExpression", object: { type: "IdentifierExpression", name: "let" }, expression: { type: "IdentifierExpression", name: "let" } }
    );

    testParse("(let.let)", expr,
      { type: "StaticMemberExpression", object: { type: "IdentifierExpression", name: "let" }, property: "let" }
    );

    testParse("for(let;;);", stmt,
      { type: "ForStatement",
        init: { type: "IdentifierExpression", name: "let" },
        test: null,
        update: null,
        body: { type: "EmptyStatement"}
      }
    );

    testParse("for(let();;);", stmt,
      { type: "ForStatement",
        init: { type: "CallExpression", callee: { type: "IdentifierExpression", name: "let" }, arguments: [] },
        test: null,
        update: null,
        body: { type: "EmptyStatement"}
      }
    );

    testParse("for(let in 0);", stmt,
      { type: "ForInStatement",
        left: { type: "IdentifierExpression", name: "let" },
        right: { type: "LiteralNumericExpression", value: 0},
        body: { type: "EmptyStatement"}
      }
    );

    testParse("for(let yield in 0);", stmt,
      { type: "ForInStatement",
        left: {
          type: "VariableDeclaration",
          kind: "let",
          declarators: [ {
            type: "VariableDeclarator",
            binding: { name: "yield", type: "BindingIdentifier" },
            init: null
          } ] },
        right: { type: "LiteralNumericExpression", value: 0},
        body: { type: "EmptyStatement"}
      }
    );

    testParse("for(let.let in 0);", stmt,
      { type: "ForInStatement",
        left: { type: "StaticMemberExpression", object: { type: "IdentifierExpression", name: "let" }, property: "let" },
        right: { type: "LiteralNumericExpression", value: 0},
        body: { type: "EmptyStatement"}
      }
    );

    testParseFailure("for(let of 0);", "Unexpected token of");
    testParseFailure("for(let.let of 0);", "Unexpected token of");
  });

  suite("unicode identifier", function () {
    // Unicode
    testParse("日本語", expr,
      { type: "IdentifierExpression", name: "日本語" }
    );

    testParse("T\u203F", expr,
      { type: "IdentifierExpression", name: "T\u203F" }
    );

    testParse("T\u200C", expr,
      { type: "IdentifierExpression", name: "T\u200C" }
    );

    testParse("T\u200D", expr,
      { type: "IdentifierExpression", name: "T\u200D" }
    );

    testParse("\u2163\u2161", expr,
      { type: "IdentifierExpression", name: "\u2163\u2161" }
    );

    testParse("\u2163\u2161\u200A", expr,
      { type: "IdentifierExpression", name: "\u2163\u2161" }
    );

  });
});
