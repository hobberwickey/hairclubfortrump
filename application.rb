require "rubygems"
require "bundler"
require "sinatra/base"
require 'sinatra/flash'
require 'sinatra/reloader'

require "json"
require "yaml"
require 'active_record'

require 'paperclip/rack'
require 'aws/ses'

require 'will_paginate'
require 'will_paginate/active_record'

require 'dotenv'

Dotenv.load
# ENV['RACK_ENV'] ||= 'development'
# Bundler.require :default, (ENV["RACK_ENV"] || "development").to_sym

Bundler.require :default, (ENV["RACK_ENV"] || "development").to_sym

DB_CONFIG = YAML::load_file(File.join(__dir__, 'config/database.yml'))[ENV["RACK_ENV"] || "development"]
ActiveRecord::Base.raise_in_transactional_callbacks = true # To silence all those stupid warnings
ActiveRecord::Base.establish_connection(DB_CONFIG)

class Application < Sinatra::Base
  enable :sessions

  configure :development do
    Paperclip::Attachment.default_options.merge!(
      path: "#{root}/public/system/:class/:attachment/:id_partition/:style/:filename"
    )
  end

  configure :production do
    Paperclip::Attachment.default_options.merge!(
      storage: :s3,
      s3_credentials: {
        bucket:            ENV['S3_BUCKET_NAME'],
        access_key_id:     ENV['AWS_ACCESS_KEY_ID'],
        secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
      }
    )
  end

  get "/" do
    send_file "views/index.html"
  end

  post "/image" do

  end

  put "/image" do

  end

  get "/albums" do

  end

  get "/albums/:id" do

  end
end

%w(lib models).each do |dir|
  Dir.glob(File.join(__dir__, dir, '**', '*.rb')) { |f| require f }
end
