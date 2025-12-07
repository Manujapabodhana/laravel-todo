<?php
  
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\TaskController;

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    Route::post('/logout', [AuthController::class, 'logout'])
        ->middleware('auth:api')->name('logout');

    Route::post('/refresh', [AuthController::class, 'refresh'])
        ->middleware('auth:api')->name('refresh');

    Route::post('/me', [AuthController::class, 'me'])
        ->middleware('auth:api')->name('me');
});

/*
|--------------------------------------------------------------------------
| Tasks API (JWT Protected)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
});
