require './application'
require 'sass/plugin/rack'
require 'rack/contrib'

use Rack::PostBodyContentTypeParser


Sass::Plugin.options[:style] = :compressed
use Sass::Plugin::Rack

run Application
