require './application'
require 'sass/plugin/rack'
require 'rack/contrib'

$stdout.sync = true

use Rack::PostBodyContentTypeParser


Sass::Plugin.options[:style] = :compressed
use Sass::Plugin::Rack

run Application
