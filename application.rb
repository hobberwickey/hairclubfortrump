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
ActiveRecord::Base.raise_in_transactional_callbacks = true # To silence all those stupid warnings
ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'])

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
    erb :index
  end

  get %r{/gallery/.*} do
    puts "GETTING HERE FIRST"
    erb :index
  end

  get "/gallery/:album_name/:uuid" do
    @image_uuid = params[:uuid]
    puts "IMAGE UUID: #{@image_uuid}"
    erb :index
  end

  get "/image/:uuid" do
    require "open-uri"

    image = Image.where(:uuid => params[:uuid]).first
    if image
      send_file open(image.file(:gallery)), type: 'image/jpeg', disposition: 'inline'   
    else
      send_file "/images/trump-hair-1.png"
    end
  end

  post "/image" do
    file = Paperclip.io_adapters.for(params[:image_data])
    file.original_filename = SecureRandom.hex(24)

    image = Image.new :title => params[:title], :file => file 
    if image.save
      image.set_tags params[:tag_ids]
      
      #This seems wonky, but it's to get the uuid
      Image.where(:id => image.id).first.to_json
    else
      status 500
      { success: false }.to_json
    end
  end

  put "/image" do

  end

  get "/albums" do
    Tag.with_thumbs.to_json
  end

  get "/albums/:id" do
    Tag.find( params[:id] ).images.map { |i| 
      { uuid: i.uuid, title: i.title, thumb: i.file(:thumb), gallery: i.file(:gallery) } 
    }.to_json
  end
end

%w(lib models).each do |dir|
  Dir.glob(File.join(__dir__, dir, '**', '*.rb')) { |f| require f }
end
