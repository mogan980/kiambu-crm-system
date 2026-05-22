<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = ['name','phone','source','county','interest','status','next_follow_up','notes'];
}
