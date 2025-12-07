<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    // GET /api/tasks
    public function index(Request $request)
    {
        return $request->user()
            ->tasks()
            ->latest()
            ->get();
    }

    // POST /api/tasks
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255'
        ]);

        $task = $request->user()->tasks()->create([
            'title' => $request->title
        ]);

        return response()->json($task, 201);
    }

    // DELETE /api/tasks/{id}
    public function destroy(Request $request, $id)
    {
        $task = $request->user()->tasks()->findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }
}
