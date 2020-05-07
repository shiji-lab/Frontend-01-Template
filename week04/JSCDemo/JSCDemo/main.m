//
//  main.m
//  JSCDemo
//
//  Created by sj on 2020/5/4.
//  Copyright © 2020 sj.lab. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        // insert code here...
        
        // const context = new JSContext;
        JSContext* context = [[JSContext alloc] init];
        JSValue* result;
        
//        while (true) {
//            char sourcecode[1024];
//
//            scanf("%s", &sourcecode);
//
//            NSString* code = [NSString stringWithUTF8String:sourcecode];
//
//            NSLog(@"%@", code);
//
//            // context.eval("");
//            result = [context evaluateScript:code];
//
//            // console.log(result.toString());
//            NSLog(@"%@", [result toString]);
//        }
        
//        NSString* code = @"(function(x) {return x * x})";
        NSString* code = @"new Promise(resolve => resolve()).then(() => this.a = 3), function() { return this.a };";
//        NSLog(@"%@", code);
        
        // context.eval("");
        result = [context evaluateScript:code];
        
        NSLog(@"%@", [result toString]);
        
        result = [result callWithArguments:@[]];
        
        NSLog(@"%@", [result toString]);
        
        
        
//        JSValue* arg1 = [JSValue valueWithInt32:4 inContext:context];
        
        // console.log(result.toString());
//        NSLog(@"%@", [[result callWithArguments:@[arg1]] toString]);
       
        
    }
    return 0;
}
